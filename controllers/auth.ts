import { User } from "../models"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, UnauthenticatedError } from "../errors"
import { OTP, IUser } from "../types/models"
import { Request, Response } from "express"
import SendMail from "../utils/sendMail"
import setAuthTokenCookie from "../utils/setCookie/setAuthToken"
import { OAuth2Client } from "google-auth-library"
import { io } from "../socketio"

const client = new OAuth2Client()

const register = async (req: Request, res: Response) => {
    const { name, email } = req.body

    //data validation
    if (!name || !email) throw new BadRequestError("Please provide all details")

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const otp: OTP = {
        value: otpCode,
        expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    }

    const userExist = await User.findOne({ email }) // Using findOne

    if (userExist) {
        switch (userExist.status) {
            case "inactive":
                if (userExist.name !== name) {
                    userExist.name = name
                }
                userExist.otp = otp
                await userExist.save()
                break
            case "blocked":
                return res.status(StatusCodes.FORBIDDEN).json({
                    success: false,
                    msg: "User with this email is blocked.",
                }) // Forbidden status
            case "active":
                return res.status(StatusCodes.CONFLICT).json({
                    success: false,
                    msg: "User with this email already exists",
                }) // Conflict status
            default:
                break
        }
    } else {
        const user = await User.create({
            name,
            email,
            otp,
        })
    }

    await SendMail({
        from: process.env.SMTP_EMAIL_USER,
        to: email,
        subject: "Blogmind: Email Verification",
        text: `Thank you for registering with Blogmind! Your OTP (One-Time Password) is ${otpCode}. Please use this code to verify your email." : ""}`,
        html: `<h1>Thank you for registering with Blogmind!</h1><p>Your OTP (One-Time Password) is <strong>${otpCode}</strong>. Please use this code to verify your email.</p>`,
    })

    res.status(StatusCodes.CREATED).json({
        success: true,
        msg: "OTP sent to your email. Please verify your email.",
    })
}

const login = async (req: Request, res: Response) => {
    const { email, password } = req.body
    if (!email && !password)
        throw new BadRequestError("Please provide email and password")
    else if (!email) throw new BadRequestError("Please provide email")
    else if (!password) throw new BadRequestError("Please provide password")

    const user = await User.findOne({ email })

    if (!user) throw new UnauthenticatedError("Email Not Registered.")
    if (user.status === "inactive")
        throw new UnauthenticatedError("User is inactive.")
    if (user.status === "blocked")
        throw new UnauthenticatedError("User is blocked.")

    if (!user.password)
        throw new UnauthenticatedError(
            "Please login with Google.\nOr Reset Password.",
        )

    const isPasswordCorrect = await user.comparePassword(password)

    if (!isPasswordCorrect) throw new UnauthenticatedError("Invalid Password.")

    setAuthTokenCookie(res, user)
    res.status(StatusCodes.CREATED).json({
        success: true,
        msg: "User Login Successfully",
    })
}

const continueWithGoogle = async (req: Request, res: Response) => {
    const tokenId = req.body.tokenId

    let payload: any = null

    try {
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        })
        payload = ticket.getPayload()
    } catch (error) {
        console.log(error)
        throw new BadRequestError("Invalid Token")
    }

    const { email, name, picture } = payload
    let user = await User.findOne({ email })
    if (user) {
        if (user.status === "blocked")
            throw new UnauthenticatedError("User is blocked.")
    } else {
        user = await User.create({
            name,
            email,
            image: picture,
            status: "active",
        })
    }
    setAuthTokenCookie(res, user)
    res.status(StatusCodes.CREATED).json({
        success: true,
        msg: "Google Login Successfully",
    })
}

const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body
    if (!email) throw new BadRequestError("Please provide email")

    const user = await User.findOne({ email })
    if (!user) throw new UnauthenticatedError("Email Not Registered.")

    if (user.status === "blocked")
        return res.status(StatusCodes.FORBIDDEN).json({
            success: false,
            msg: "User with this email is blocked.",
        }) // Forbidden status

    //generate OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const otp: OTP = {
        value: otpCode,
        expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    }

    //save otp to user
    user.otp = otp
    await user.save()

    //send otp to email
    await SendMail({
        from: process.env.SMTP_EMAIL_USER,
        to: email,
        subject: "Blogmind: Reset Password",
        text: `Your OTP (One-Time Password) is ${otpCode}. Please use this code to reset your password.`,
        html: `<h1>Your OTP (One-Time Password) is <strong>${otpCode}</strong>. Please use this code to reset your password.</h1>`,
    })
    res.status(StatusCodes.CREATED).json({
        success: true,
        msg: "OTP sent to your email. Please verify your email.",
    })
}

const verifyOtp = async (req: Request, res: Response) => {
    const { otp, email, password } = req.body

    if (!otp || !email || !password)
        throw new BadRequestError("Please provide all details")

    const user = await User.findOne({ email, "otp.value": otp })
    if (!user) throw new UnauthenticatedError("Invalid OTP.")
    if (user.status === "blocked")
        throw new UnauthenticatedError("User is blocked.")

    if (user.otp && user.otp.expires < new Date()) {
        user.otp = undefined
        await user.save()
        throw new UnauthenticatedError("OTP Expired. Please try again.")
    }

    user.otp = undefined
    user.password = password
    user.status = "active"
    await user.save()

    setAuthTokenCookie(res, user)

    res.status(StatusCodes.CREATED).json({
        success: true,
        msg: "Password Changed Successfully",
    })
}

const signOut = async (req: Request, res: Response) => {
    //clear all cookies
    for (const cookie in req.cookies) {
        res.clearCookie(cookie)
    }

    io?.sockets.sockets.forEach((socket) => {
        if (socket.user.userId === req.user?.userId) {
            socket.disconnect()
        }
    })

    res.status(StatusCodes.OK).json({
        success: true,
        msg: "User Logout Successfully",
    })
}

export {
    register,
    login,
    continueWithGoogle,
    forgotPassword,
    verifyOtp,
    signOut,
}
