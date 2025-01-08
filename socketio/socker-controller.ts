import { IsEnum, IsMongoId, IsNotEmpty, IsString, validate } from "class-validator";
import { Socket, Server as SocketIOServer } from "socket.io";
import { Channel, Message } from "../models";
import { RabbitMQ } from "../rabbitmq";
import { Type } from "./type.interface";
import { EventsEnum, RolesEnum } from "../enums";

const serverName = process.env.SERVER_NAME as string

function validation<T>(payload: any, classRef: Type<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        const payloadInstance = Object.assign(Object.assign({}, new classRef()), payload);
        validate(payloadInstance).then((errors) => {
            if (errors.length > 0) {
                reject(errors);
            } else {
                resolve(payloadInstance);
            }
        });
    });
}

class NewMessage {
    @IsMongoId()
    @IsNotEmpty()
    channelId!: string;

    @IsString()
    @IsNotEmpty()
    message!: string;
}

export class Member {
    @IsMongoId()
    @IsNotEmpty()
    userId!: string

    @IsNotEmpty()
    @IsEnum(RolesEnum)
    role!: RolesEnum;
}

class NewGroup {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsNotEmpty()
    members!: Member[];
}

class NewChat {
    @IsNotEmpty()
    member!: Member;
}

const bucketValue = 500

function getBucket() {
    return bucketValue
}

export function sendMessage(io: SocketIOServer, socket: Socket, rabbitMq: RabbitMQ) {
    return async (data: any, callback: any) => {
        if (typeof callback !== "function") {
            return;
        }
        try {

            const payload = await validation(data, NewMessage)

            const channel = await Channel.findById(payload.channelId);
            // check if part of the channel
            if (channel === null || !channel.members.some((m) => m.userId.toString() === socket.user.userId.toString())) {
                throw new Error("You are not part of this channel");
            }

            const message = new Message({
                channelId: payload.channelId,
                bucket: getBucket(),
                senderId: socket.user.userId,
                message: payload.message,
            })

            // const jsonEvent = Buffer.from(JSON.stringify(message.toJSON()));
            const jsonEvent = Buffer.from(JSON.stringify({ event: EventsEnum.NewMessage, data: message.toJSON() }));
            console.log("Sending message");

            const promises: Promise<any>[] = [];
            promises.push(message.save());
            for (const member of channel.members) {
                rabbitMq.messageChannel.publish("messages", member.userId.toString(), jsonEvent);
            }
            await Promise.all(promises);
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
            const payload = await validation(data, NewGroup)
            const newGroup = new Channel({
                name: payload.name,
                members: payload.members,
                isGroup: true,
            })

            const jsonEvent = Buffer.from(JSON.stringify({ event: EventsEnum.NewGroup, data: newGroup.toJSON() }));

            const promises: Promise<any>[] = [];
            promises.push(newGroup.save());
            for (const member of payload.members) {
                rabbitMq.messageChannel.publish("messages", member.userId.toString(), jsonEvent);
            }
            await Promise.all(promises);
            callback({ success: true, data: newGroup.toJSON() });
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
            const payload = await validation(data, NewChat)
            const newChannel = new Channel({
                members: [payload.member],
                isGroup: false,
            })

            const jsonEvent = Buffer.from(JSON.stringify({ event: EventsEnum.NewChat, data: newChannel.toJSON() }));

            const promises: Promise<any>[] = [];
            promises.push(newChannel.save());
            rabbitMq.messageChannel.publish("messages", payload.member.userId.toString(), jsonEvent);
            await Promise.all(promises);
            callback({ success: true, data: newChannel.toJSON() });
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
            });

            console.log("get Channel");
            
            callback({ success: true, data: channels });
        } catch (error) {
            console.log(error);
            callback({ success: false, errors: error });
        }
    }
}

// export function getMessages(io: SocketIOServer, socket: Socket, rabbitMq: RabbitMQ) {
//     return async (data: any, callback: any) => {
//         if (typeof callback !== "function" || rabbitMq === null) {
//             return;
//         }
//         const payloadInstance = Object.assign(new NewMessage(), data);
//         const errors = await validate(payloadInstance);

//         if (errors.length > 0) {
//             console.error("Validation errors", errors);
//             callback({ success: false, errors });
//             return;
//         }
//     }
// }

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