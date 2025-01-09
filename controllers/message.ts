import { Schema, Types } from "mongoose";
import { Socket, Server as SocketIOServer } from "socket.io";
import { EventsEnum, RolesEnum } from "../enums";
import { Channel, Message } from "../models";
import ChatMessage from "../models/message";
import { RabbitMQ } from "../rabbitmq";
import { getBucket } from "../utils/buckets";
import { NewChat, NewGroup, NewMessage, validatePayload } from "../socketio/validation";

const serverName = process.env.SERVER_NAME as string

function broadcastMessage<T>(rabbitMq: RabbitMQ, members: string[], message: any) {
    const jsonEvent = Buffer.from(JSON.stringify(message));
    for (const member of members) {
        rabbitMq.messageChannel.publish("messages", member, jsonEvent);
    }
}

export function sendMessage(io: SocketIOServer, socket: Socket, rabbitMq: RabbitMQ) {
    return async (data: any, callback: any) => {
        if (typeof callback !== "function") {
            return;
        }
        try {

            const payload = await validatePayload(data, NewMessage)

            const channel = await Channel.findById(payload.channelId);
            // check if part of the channel
            if (channel === null || !channel.members.some((m) => m.userId.toString() === socket.user.userId.toString())) {
                throw new Error("You are not part of this channel");
            }

            console.log("Sending message");
            const messageId = new Types.ObjectId();
            const message = new Message({
                _id: messageId,
                channelId: payload.channelId,
                bucket: getBucket(messageId),
                senderId: socket.user.userId,
                message: payload.message,
            })

            const messageToBroadcast = {
                event: EventsEnum.NewMessage,
                data: message.toJSON(),
            }

            broadcastMessage(rabbitMq, channel.members.map((m) => m.userId.toString()), messageToBroadcast);
            await message.save()
            callback({ success: true, data: message.toJSON() });
        } catch (error) {
            console.log(error);
            callback({ success: false, errors: error });
        }
    }
}

export function createGroup(io: SocketIOServer, socket: Socket, rabbitMq: RabbitMQ) {
    return async (data: any, callback: any) => {
        if (typeof callback !== "function") {
            return;
        }
        try {
            const payload = await validatePayload(data, NewGroup)
            const members = Array.from(new Set(payload.members))
                .filter((m) => m !== socket.user.userId.toString())
                .map((m) => ({ userId: m, role: RolesEnum.MEMBER }))
            members.push({ userId: socket.user.userId.toString(), role: RolesEnum.ADMIN });

            const { _id } = await Channel.create({
                name: payload.name,
                members: members,
                isGroup: true,
            })

            const newGroup = await Channel.findById(_id).populate<{
                members: [{
                    userId: {
                        _id: Schema.Types.ObjectId,
                        name: string,
                        email: string,
                        phoneNo: string,
                        image: string
                    }
                }]
            }>({
                path: 'members.userId',
                select: 'name email phoneNo image',
            })
            if (newGroup === null) {
                throw new Error("Internal Server Error: Group not found");
            }

            const messageToBroadcast = {
                event: EventsEnum.NewGroup,
                data: { ...newGroup.toJSON(), messages: [] },
            }

            broadcastMessage(rabbitMq, newGroup.members.map((m) => m.userId._id.toString()), messageToBroadcast);

            callback({ success: true, data: newGroup._id });
        } catch (error) {
            console.log(error);
            callback({ success: false, errors: error });
        }
    }
}

export function createChat(io: SocketIOServer, socket: Socket, rabbitMq: RabbitMQ) {
    return async (data: any, callback: any) => {
        if (typeof callback !== "function") {
            return;
        }
        try {
            const payload = await validatePayload(data, NewChat)

            const { _id } = await Channel.create({
                members: [{ userId: payload.member }, { userId: socket.user.userId }],
                isGroup: false,
            })

            const newChannel = await Channel.findById(_id).populate<{
                members: [{
                    userId: {
                        _id: Schema.Types.ObjectId,
                        name: string,
                        email: string,
                        phoneNo: string,
                        image: string
                    }
                }]
            }>({
                path: 'members.userId',
                select: 'name email phoneNo image',
            })
            if (!newChannel) {
                throw new Error("Internal Server Error: Group not found");
            }

            await newChannel.save();
            const messageToBroadcast = {
                event: EventsEnum.NewChat,
                data: { ...newChannel.toJSON(), messages: [] },
            }
            broadcastMessage(rabbitMq, newChannel.members.map((m) => m.userId._id.toString()), messageToBroadcast);
            callback({ success: true, data: newChannel._id });
        } catch (error) {
            console.log(error);
            callback({ success: false, errors: error });
        }
    }
}

export function getChannels(io: SocketIOServer, socket: Socket) {
    return async (data: any, callback: any) => {
        if (typeof callback !== "function") {
            return;
        }
        try {
            const channels = await Channel.find({
                members: {
                    $elemMatch: {
                        userId: socket.user.userId,
                    },
                },
            }).populate({
                path: 'members.userId',
                select: 'name email phoneNo image',
            })

            const messagesPerChannel = await ChatMessage.aggregate([
                { $match: { channelId: { $in: channels.map((c) => c._id) } } },
                { $sort: { createdAt: 1 } },
                {
                    $group: {
                        _id: "$channelId",
                        messages: { $push: "$$ROOT" }
                    }
                },
            ]);

            const channelsWithMessages = channels.map((channel) => {
                const messages = messagesPerChannel.find((m) => m._id.toString() === channel.id.toString());
                return {
                    ...channel.toJSON(),
                    messages: messages?.messages || [],
                }
            })


            callback({ success: true, data: channelsWithMessages });
        } catch (error) {
            console.log(error);
            callback({ success: false, errors: error });
        }
    }
}

export function getServerName(io: SocketIOServer, socket: Socket) {
    return async (data: any, callback: any) => {
        if (typeof callback !== "function") {
            return;
        }
        callback({ success: true, data: serverName });
    }
}

export function disconnect(_io: SocketIOServer, socket: Socket, rabbitMq: RabbitMQ) {
    return async (data: string) => {
        try {
            console.log(data);
            socket.removeAllListeners()
            await rabbitMq?.messageChannel.unbindQueue(serverName, "messages", socket.user.userId.toString())
            console.log("Disconnected: Socket %s UserId %s", socket.id, socket.user.userId)
        } catch (error) {
            console.log(error)
        }
    }
}