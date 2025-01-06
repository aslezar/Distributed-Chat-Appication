import { User, Group } from "../models"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, UnauthenticatedError, NotFoundError } from "../errors"
import { Request, Response } from "express"
import mongoose from "mongoose"
import {
    uploadProfileImage as cloudinaryUploadProfileImage,
    deleteProfileImage as cloudinaryDeleteProfileImage,
} from "../utils/imageHandlers/cloudinary"
import setAuthTokenCookie from "../utils/setCookie/setAuthToken"

const getMe = async (req: Request, res: Response) => {
    const user = await User.findById(req.user.userId).select(
        "name email phoneNo image createdAt",
    )
    if (!user) throw new NotFoundError("User Not Found")
    if (user.status === "blocked")
        throw new UnauthenticatedError("User is blocked.")
    if (user.status === "inactive")
        throw new UnauthenticatedError("User is inactive.")

    setAuthTokenCookie(res, user)

    const socketToken = user.generateSocketToken()

    const data = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNo: user.phoneNo,
        image: user.image,
        socketToken,
        createdAt: user.createdAt,
    }

    res.status(StatusCodes.CREATED).json({
        data,
        success: true,
        msg: "User Fetched Successfully",
    })
}

const updateUser = async (
    userId: mongoose.Types.ObjectId,
    key: string,
    value: any,
) => {
    const user = await User.findById(userId)
    if (!user) throw new NotFoundError("User Not Found")
    user.set({ [key]: value })
    await user.save()
}

const updateCompleteProfile = async (req: Request, res: Response) => {
    const { name } = req.body
    const userId = req.user.userId

    if (!name) throw new BadRequestError("Name or Phone Number are required")

    const user = await User.findByIdAndUpdate(userId, {
        name,
    })

    res.status(StatusCodes.OK).json({
        success: true,
        msg: "Profile Updated",
    })
}

const updateProfileImage = async (req: Request, res: Response) => {
    const userId = req.user.userId
    if (!req.file) throw new BadRequestError("Image is required")

    const isDeleted: boolean = await cloudinaryDeleteProfileImage(userId as any)
    if (!isDeleted) throw new BadRequestError("Failed to delete image")

    const cloudinary_img_url = await cloudinaryUploadProfileImage(req)
    await updateUser(userId, "image", cloudinary_img_url)

    res.status(StatusCodes.OK).json({
        data: { image: cloudinary_img_url },
        success: true,
        msg: "Profile Image Updated",
    })
}

const deleteProfileImage = async (req: Request, res: Response) => {
    const userId = req.user.userId

    const isDeleted: boolean = await cloudinaryDeleteProfileImage(userId as any)
    if (!isDeleted) throw new BadRequestError("Failed to delete image")
    await updateUser(
        userId,
        "image",
        "https://res.cloudinary.com/dzvci8arz/image/upload/v1715358550/iaxzl2ivrkqklfvyasy1.jpg",
    )

    res.status(StatusCodes.OK).json({
        data: {
            defaultImage:
                "https://res.cloudinary.com/dzvci8arz/image/upload/v1715358550/iaxzl2ivrkqklfvyasy1.jpg",
        },
        success: true,
        msg: "Profile Image Deleted",
    })
}

const getGroup = async (req: Request, res: Response) => {
    console.log(req.params.groupId)
    console.log("You are here")

    const groupId = req.params.groupId
    const userId = req.user.userId

    const group = await Group.findOne({
        _id: groupId,
        "members.user": userId,
    }).populate("members.user", "name image phoneNo")

    if (!group)
        throw new NotFoundError("Group Not Found or You are not authorized.")

    return res.status(StatusCodes.OK).json({
        data: group,
        success: true,
        // msg: `Group ${group.name} Fetched Successfully`,
    })
}

export {
    getMe,
    updateCompleteProfile,
    updateProfileImage,
    deleteProfileImage,
    getGroup,
}
