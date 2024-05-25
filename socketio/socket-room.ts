import { Server as SocketIOServer, Socket } from "socket.io"
import Joi from "joi"
import Channel from "../models/channel"
import ChatMessage from "../models/chatMessage"
import { channel } from "diagnostics_channel"

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

export default (io: SocketIOServer | null, socket: Socket) => {
    if (!io) return
    console.log(`${socket.id} connected`)
    const userId = socket.user.userId
    socket.join(userId.toString())

    const joinChannel = async (data: any, cb: any) => {
        console.log(data)

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
            }).populate("members.user", "name profileImage")

            if (!channel) {
                cb({
                    msg: "Channel not found or you are not authorized.",
                    success: false,
                })
                return
            }
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
                msg: `Channel joined ${channel.name}`,
                success: true,
                data,
            })
            console.log(`${socket.id} joined channel: ${channel.name}`)
            return
        } catch (error) {
            console.log(error)
            cb({ msg: "Server: Error joining channel", success: false })
        }
    }
    const leaveChannel = (data: any, cb: any) => {
        if (errorHandler(socket, data, cb)) return
        const { channelId } = data
        try {
            socket.leave(channelId)
            cb({ msg: "Channel Left", success: true })

            console.log(`${socket.id} left channel: ${channelId}`)
        } catch (error) {
            console.log(error)
            cb({ msg: "Server: Error leaving room", success: false })
        }
    }
    const createMessage = async (data: any, cb: any) => {
        if (errorHandler(socket, data, cb)) return
        const { channelId, message } = data
        try {
            const newMessage = new ChatMessage({
                senderId: userId,
                sendToId: channelId,
                message,
            })
            await newMessage.save()

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

    socket.on("channel:join", joinChannel)
    socket.on("channel:leave", leaveChannel)
    socket.on("channel:chat", createMessage)

    socket.on("disconnect", disconnect)
}
