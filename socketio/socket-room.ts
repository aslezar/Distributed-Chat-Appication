import { Server as SocketIOServer, Socket } from "socket.io"
import { Types } from "mongoose"
import { User, Group, Message } from "../models"
import { Roles, Modal } from "../roles"

const initializeSocket = async (socket: Socket, userId: Types.ObjectId) => {
    socket.join(userId.toString())

    const groups = await Group.find({
        "members.user": userId,
    }).populate({
        path: "members.user",
        select: "name phoneNo image createdAt",
    })
    const myGroupsIds = groups.map((group) => group._id)
    myGroupsIds.forEach((group) => {
        socket.join(group.toString())
    })

    const contacts = await User.findById(userId).select("myContacts").populate({
        path: "myContacts",
        select: "name phoneNo image createdAt",
    })
    const myContactsIds =
        contacts?.myContacts.map((contact: any) => contact._id) ?? []

    const userMessages = await Message.find({
        $or: [
            {
                senderId: userId,
                receiverId: { $in: myContactsIds },
            },
            {
                senderId: { $in: myContactsIds },
                receiverId: userId,
            },
            {
                senderId: userId,
                receiverId: { $in: myGroupsIds },
            },
            {
                senderId: { $in: myGroupsIds },
                receiverId: userId,
            },
        ],
    })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate({
            path: "senderId receiverId",
            select: "name phoneNo image createdAt",
        })

    const messages = userMessages.map((message) => {
        return {
            ...message.toJSON(),
            isGroup: message.modal === "Group",
        }
    })

    socket.myContacts = myContactsIds
    socket.myGroups = myGroupsIds

    socket.emit("connection:success", {
        success: true,
        msg: "Connected to server",
        groups,
        contacts: contacts?.myContacts ?? [],
        messages,
    })
}
export default (io: SocketIOServer | null, socket: Socket) => {
    if (!io) return
    console.log(`${socket.id} connected`)
    const userId = socket.user.userId
    socket.myContacts = []
    socket.myGroups = []

    const sendMessage = async (data: any, cb: any) => {
        const { receiverId, message } = data
        if (!receiverId || !message) {
            return cb({
                success: false,
                msg: "Please provide receiverId and message",
            })
        }
        const isMyContact = socket.myContacts.some(
            (contact) => contact.toString() === receiverId,
        )
        const isMyGroup = socket.myGroups.some(
            (group) => group.toString() === receiverId,
        )
        if (!isMyContact && !isMyGroup) {
            return cb({
                success: false,
                msg: "You are not allowed to send message to this user",
            })
        }
        const newMessage = await Message.create({
            message,
            senderId: userId,
            receiverId,
            modal: isMyGroup ? Modal.GROUP : Modal.USER,
        })

        await newMessage.populate({
            path: "senderId receiverId",
            select: "name phoneNo image createdAt",
        })

        socket.to(receiverId).emit("message:new", {
            ...newMessage.toJSON(),
            isGroup: isMyGroup,
            sender: newMessage.senderId,
            receiver: newMessage.receiverId,
            //@ts-ignore
            senderId: newMessage.senderId._id,
            //@ts-ignore
            receiverId: newMessage.receiverId._id,
        })
        cb({ success: true, msg: "Message sent successfully" })
    }

    const getSender = async (data: any, cb: any) => {
        const { senderId } = data
        if (!senderId) {
            return cb({
                success: false,
                msg: "Please provide senderId",
            })
        }
        const isMyContact = socket.myContacts.some(
            (contact) => contact.toString() === senderId,
        )
        const isMyGroup = socket.myGroups.some(
            (group) => group.toString() === senderId,
        )
        if (!isMyContact && !isMyGroup) {
            return cb({
                success: false,
                msg: "You are not allowed to get sender info of this user",
            })
        }
        const sender = await User.findById(senderId).select(
            "name phoneNo image createdAt",
        )
        cb({ success: true, sender })
    }
    initializeSocket(socket, userId)
        .then(() => {
            socket.on("message:send", sendMessage)
            socket.on("get:sender", getSender)
        })
        .catch((error) => {
            console.log(error)
        })

    const disconnect = (data: any, cb: any) => {
        try {
            console.log(`${socket.id} disconnected`)
            socket.removeAllListeners()
        } catch (error) {
            console.log(error)
        }
    }
    socket.on("disconnect", disconnect)
}
