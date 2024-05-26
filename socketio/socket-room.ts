import { Server as SocketIOServer, Socket } from "socket.io"
import Joi from "joi"
import Channel from "../models/channel"
import ChatMessage from "../models/chatMessage"
import { channel } from "diagnostics_channel"
import { User } from "../models"
import Roles from "../roles"
import { Types } from "mongoose"

const payloadSchema = Joi.object({
    channelId: Joi.string().hex().length(24),
    message: Joi.string().min(1),
})

const errorHandler = (socket: Socket, data: any, cb: any) => {
    if (typeof cb !== "function") {
        socket.disconnect()
        return true
    }
    const { error, value } = payloadSchema.validate(data)
    if (error) {
        cb({ msg: error.message, success: false })
        return true
    }
    return false
}

const joinUserChannel = async (socket: Socket, userId: Types.ObjectId) => {
    const channel = await Channel.find({
        "members.user": userId,
    }).select("_id")
    channel.forEach((c) => {
        socket.join(c._id.toString())
    })
}

export default (io: SocketIOServer | null, socket: Socket) => {
    if (!io) return
    console.log(`${socket.id} connected`)
    const userId = socket.user.userId
    socket.join(userId.toString())

    joinUserChannel(socket, userId)

    const createChannel = async (data: any, cb: any) => {
        const { name, members } = data

        if (!name || !members) {
            cb({
                msg: "Name and Members are required",
                success: false,
            })
            return
        }

        const groupMember = members.map((member: string) => {
            if (member === userId.toString()) {
                return {
                    user: member,
                    role: Roles.ADMIN,
                }
            }
            return {
                user: member,
                role: Roles.MEMBER,
            }
        })

        const createGroup = await Channel.create({
            isGroup: true,
            members: groupMember,
            groupProfile: {
                groupName: name,
            },
        })

        const channel = await Channel.findById(createGroup._id).populate(
            "members.user",
            "name profileImage phoneNo",
        )

        if (!channel) {
            cb({
                msg: "Group not found",
                success: false,
            })
            return
        }

        const sendData = {
            channel: {
                ...channel.toJSON(),
                members: undefined,
            },
            members: channel.members,
            messages: [],
            isNew: true,
        }

        channel.members.forEach((member: any) => {
            if (member.user._id.toString() === userId.toString()) return
            socket.to(member.user._id.toString()).emit("channel:new", sendData)
        })

        cb({
            msg: `Group ${name} Created`,
            success: true,
            data: sendData,
        })
    }

    const joinChannel = async (data: any, cb: any) => {
        if (errorHandler(socket, data, cb)) return
        const { channelId } = data

        try {
            const myUserId = socket.user.userId
            if (!channelId) {
                cb({
                    msg: "Provide channelId",
                    success: false,
                })
                return
            }

            const channel = await Channel.findOne({
                _id: channelId,
                "members.user": myUserId,
            }).populate("members.user", "name profileImage phoneNo")

            if (!channel) {
                if (channelId === myUserId) {
                    cb({
                        msg: "You can't join your own channel",
                        success: false,
                    })
                    return
                }
                const otherUser = await User.findById(channelId)
                if (!otherUser) {
                    cb({
                        msg: "Channel not found or you are not authorized.",
                        success: false,
                    })
                    return
                } else {
                    const newChannel = await Channel.create({
                        isGroup: false,
                        members: [
                            { user: myUserId, role: Roles.MEMBER },
                            {
                                user: otherUser?._id,
                                role: Roles.MEMBER,
                            },
                        ],
                    })

                    const channel = await Channel.findById(
                        newChannel._id,
                    ).populate("members.user", "name profileImage phoneNo")
                    if (!channel) {
                        cb({
                            msg: "Channel not found",
                            success: false,
                        })
                        return
                    }

                    const data = {
                        channel: {
                            ...newChannel.toJSON(),
                            members: undefined,
                        },
                        members: channel.members,
                        messages: [],
                        isNew: true,
                    }
                    socket.join(newChannel._id.toString())
                    socket
                        .to(otherUser._id.toString())
                        .emit("channel:new", data)
                    cb({
                        msg: `Channel joined ${newChannel._id}`,
                        success: true,
                        data,
                    })
                    console.log(
                        `${socket.id} joined channel: ${newChannel._id}`,
                    )
                    return
                }
            } else {
                socket.join(channelId)
                //find last 10 messages
                const messages = await ChatMessage.find({ sendToId: channelId })
                    .sort({ createdAt: -1 })
                    .limit(10)

                const data = {
                    channel: {
                        ...channel.toJSON(),
                        members: undefined,
                    },
                    members: channel.members,
                    messages,
                }

                cb({
                    msg: `Channel joined ${channel._id}`,
                    success: true,
                    data,
                })
                console.log(`${socket.id} joined channel: ${channel._id}`)
                return
            }
        } catch (error) {
            console.log(error)
            cb({ msg: "Server: Error joining channel", success: false })
        }
    }
    const createMessage = async (data: any, cb: any) => {
        if (errorHandler(socket, data, cb)) return
        const { channelId, message } = data
        try {
            const newMessage = await ChatMessage.create({
                senderId: userId,
                sendToId: channelId,
                message,
            })

            socket.to(channelId).emit("channel:newMessage", newMessage)

            cb({
                data: newMessage,
                msg: "Server: Message created",
                success: true,
            })

            console.log(
                `${userId} sent message on room ${channel.name} with message ${message}`,
            )
        } catch (error) {
            console.log(error)
            cb({ msg: "Server: Error creating message", success: false })
        }
    }
    const disconnect = (data: any, cb: any) => {
        try {
            console.log(`${socket.id} disconnected`)
            socket.removeAllListeners()
        } catch (error) {
            console.log(error)
        }
    }

    const joinNewChannel = async (data: any, cb: any) => {
        if (errorHandler(socket, data, cb)) return
        const { channelId } = data
        try {
            const myUserId = socket.user.userId
            if (!channelId) {
                cb({
                    msg: "Provide channelId",
                    success: false,
                })
                return
            }

            const channel = await Channel.findOne({
                _id: channelId,
                "members.user": myUserId,
            }).select("_id")

            if (!channel) {
                cb({
                    msg: "Channel not found or you are not authorized.",
                    success: false,
                })
                return
            }
            socket.join(channelId)
            cb({
                msg: `Channel joined ${channel._id}`,
                success: true,
            })
            console.log(`${socket.id} joined channel: ${channel._id}`)
            return
        } catch (error) {
            console.log(error)
            cb({ msg: "Server: Error joining channel", success: false })
        }
    }
    socket.on("channel:create", createChannel)
    socket.on("channel:join", joinChannel)
    socket.on("channel:chat", createMessage)
    socket.on("Channel:joinNew", joinNewChannel)

    socket.on("disconnect", disconnect)
}
