import { User, Channel, ChatMessage } from "../models"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, UnauthenticatedError, NotFoundError } from "../errors"
import { Request, Response } from "express"
import mongoose from "mongoose"
import {
    uploadProfileImage as cloudinaryUploadProfileImage,
    deleteProfileImage as cloudinaryDeleteProfileImage,
} from "../utils/imageHandlers/cloudinary"
import setAuthTokenCookie from "../utils/setCookie/setAuthToken"
import Roles from "../roles"

const getMe = async (req: Request, res: Response) => {
    const user = await User.findById(req.user.userId)
    if (!user) throw new NotFoundError("User Not Found")
    if (user.status === "blocked")
        throw new UnauthenticatedError("User is blocked.")
    if (user.status === "inactive")
        throw new UnauthenticatedError("User is inactive.")

    setAuthTokenCookie(res, user)

    const socketToken = user.generateSocketToken()

    const channel = await Channel.find({
        "members.user": user._id,
    }).populate("members.user", "name profileImage phoneNo")

    //find lastMessage of each channel
    const messages = await ChatMessage.aggregate([
        { $match: { sendToId: { $in: channel.map((c) => c._id) } } },
        { $sort: { createdAt: -1 } },
        {
            $group: {
                _id: "$sendToId",
                lastMessage: { $first: "$$ROOT" },
            },
        },
    ])

    const channels = channel.map((c) => {
        const lastMessage = messages.find(
            (m) => m._id.toString() === c._id.toString(),
        )
        return {
            _id: c._id,
            name: c.name,
            isGroup: c.isGroup,
            groupProfile: c.groupProfile,
            members: c.members,
            lastMessage: lastMessage ? lastMessage.lastMessage : null,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
        }
    })

    const sendUser = {
        userId: user._id,
        name: user.name,
        email: user.email,
        phoneNo: user.phoneNo,
        profileImage: user.profileImage,
        socketToken,
        channels,
    }

    res.status(StatusCodes.CREATED).json({
        data: sendUser,
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
    await updateUser(userId, "profileImage", cloudinary_img_url)

    res.status(StatusCodes.OK).json({
        data: { profileImage: cloudinary_img_url },
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
        "profileImage",
        "https://res.cloudinary.com/dzvci8arz/image/upload/v1715358550/iaxzl2ivrkqklfvyasy1.jpg",
    )

    res.status(StatusCodes.OK).json({
        data: {
            defaultProfileImage:
                "https://res.cloudinary.com/dzvci8arz/image/upload/v1715358550/iaxzl2ivrkqklfvyasy1.jpg",
        },
        success: true,
        msg: "Profile Image Deleted",
    })
}

const createGroup = async (req: Request, res: Response) => {
    const { name, members } = req.body
    const userId = req.user.userId

    if (!name || !members)
        throw new BadRequestError("Name and Members are required")

    const groupMember = members.map((member: string) => {
        if (member === userId.toString()) {
            return {
                userId: member,
                role: Roles.ADMIN,
            }
        }
        return {
            userId: member,
            role: Roles.MEMBER,
        }
    })

    const group = new Channel({
        name,
        members: groupMember,
        isGroup: true,
    })

    await group.save()

    res.status(StatusCodes.CREATED).json({
        data: { groupId: group._id },
        success: true,
        msg: `Group ${name} Created`,
    })
}

export {
    getMe,
    updateCompleteProfile,
    updateProfileImage,
    deleteProfileImage,
    createGroup,
}
