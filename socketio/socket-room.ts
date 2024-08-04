import { Server as SocketIOServer, Socket } from "socket.io"
import { Types } from "mongoose"
import { User, Group, Message } from "../models"
import { ROLES, MODAL } from "../roles"
import { Member } from "../types/models"

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

    const userMessages = await Message.aggregate([
        {
            $match: {
                $or: [
                    { senderId: userId },
                    { receiverId: userId, modal: MODAL.USER },
                    { receiverId: { $in: myGroupsIds }, modal: MODAL.GROUP },
                ],
            },
        },
        {
            $addFields: {
                isGroup: { $eq: ["$modal", MODAL.GROUP] },
            },
        },
        {
            $project: {
                modal: 0,
            },
        },
        // {
        //     $sort: { createdAt: -1 }, // Sort by createdAt in descending order
        // },
        // {
        //     $project: {
        //         messages: { $slice: ["$messages", 10] }, // Select the top 10 messages from each group
        //     },
        // },
    ])

    //print all receiverId from user messages
    // console.log(userMessages)

    // console.log(userMessages[0])

    // const messages = userMessages.map((message) => {
    //     return {
    //         receiverId: message._id,
    //         message: message.messages.map((msg: any) => {
    //             const isGroup = myGroupsIds.some(
    //                 (group) => group.toString() === msg.receiverId.toString(),
    //             )
    //             return {
    //                 ...msg,
    //                 isGroup: msg.modal === Modal.GROUP,
    //             }
    //         }),
    //     }
    // })

    // console.log(messages[0])

    socket.myContacts = myContactsIds
    socket.myGroups = myGroupsIds

    socket.emit("connection:success", {
        success: true,
        msg: "Connected to server",
        groups,
        contacts: contacts?.myContacts ?? [],
        messages: userMessages,
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
            modal: isMyGroup ? MODAL.GROUP : MODAL.USER,
        })

        await newMessage.populate({
            path: "senderId receiverId",
            select: "name phoneNo image createdAt",
        })

        const dataMessage = {
            ...newMessage.toJSON(),
            isGroup: isMyGroup,
            sender: newMessage.senderId,
            receiver: newMessage.receiverId,
            //@ts-ignore
            senderId: newMessage.senderId._id,
            //@ts-ignore
            receiverId: newMessage.receiverId._id,
        }

        if (isMyContact) {
            socket.to(receiverId).emit("message:new", dataMessage)
        } else {
            io.to(receiverId).emit("message:new", dataMessage)
        }

        cb({
            success: true,
            msg: "Message sent successfully",
            message: dataMessage,
        })
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
    const newGroup = async (data: any, cb: any) => {
        const { name, members } = data

        if (!name || !members) {
            return cb({
                success: false,
                msg: "Please provide name and members",
            })
        }
        const groupMembers = new Map<string, Member>()

        members.forEach((member: any) => {
            groupMembers.set(member, {
                user: member,
                role: ROLES.MEMBER,
            })
        })

        groupMembers.set(userId.toString(), {
            user: userId as any,
            role: ROLES.ADMIN,
        })

        const newGroup = await Group.create({
            name,
            members: Array.from(groupMembers.values()),
        })
        const group = await newGroup.populate({
            path: "members.user",
            select: "name phoneNo image createdAt",
        })

        const groupMembersIds = group.members.map((member: any) =>
            member.user._id.toString(),
        )

        socket.myGroups.push(newGroup._id)
        io.sockets.sockets.forEach((s) => {
            if (groupMembersIds.includes(s.user.userId.toString())) {
                s.myGroups.push(newGroup._id)
                s.join(newGroup._id.toString())
                s.emit("new:group", group)
            }
        })

        cb({
            success: true,
            msg: "Group created successfully",
            group,
        })
    }
    const newContact = async (data: any, cb: any) => {
        const { contactId } = data
        console.log(data)

        if (!contactId) {
            return cb({
                success: false,
                msg: "Please provide contactId",
            })
        }

        const isMyContact = socket.myContacts.some(
            (contact) => contact.toString() === contactId,
        )
        if (isMyContact) {
            return cb({
                success: false,
                msg: "Contact already added",
            })
        }

        const contact = await User.findByIdAndUpdate(
            contactId,
            {
                $push: { myContacts: userId },
            },
            {
                new: true,
            },
        ).select("name phoneNo image createdAt")
        if (!contact) {
            return cb({
                success: false,
                msg: "Contact not found",
            })
        }
        const user = await User.findByIdAndUpdate(userId, {
            $push: { myContacts: contactId },
        }).select("name phoneNo image createdAt")

        io.sockets.sockets.forEach((s) => {
            if (s.user.userId.toString() === contactId) {
                s.myContacts.push(userId)
                s.emit("new:contact", user)
            }
        })
        socket.myContacts.push(contactId)
        cb({
            success: true,
            msg: "Contact added successfully",
            contact,
        })
    }

    initializeSocket(socket, userId)
        .then(() => {
            socket.on("message:send", sendMessage)
            socket.on("get:sender", getSender)
            socket.on("create:group", newGroup)
            socket.on("create:contact", newContact)
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
