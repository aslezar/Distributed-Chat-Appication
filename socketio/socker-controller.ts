import { IsMongoId, IsNotEmpty, IsString, validate } from "class-validator";
import { Socket, Server as SocketIOServer } from "socket.io";
import { Channel, Message } from "../models";
import { RabbitMQ } from "../rabbitmq";
import { Type } from "./type.interface";

function Logger(target: Function) {
    console.log(`Class ${target.name} is being decorated`);
}

@Logger
class Payload {
    @IsMongoId()
    @IsNotEmpty()
    channelId!: string;

    @IsString()
    @IsNotEmpty()
    message!: string;
}

const bucketValue = 500

function getBucket() {
    return bucketValue
}

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

export function sendMessage(io: SocketIOServer, socket: Socket, rabbitMq: RabbitMQ) {
    return async (data: any, callback: any) => {
        if (typeof callback !== "function" || rabbitMq === null) {
            return;
        }
        try {

            const payload = await validation(data, Payload)

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

            const jsonMessage = Buffer.from(JSON.stringify(message.toJSON()));
            console.log("Sending message");

            const promises: Promise<any>[] = [];
            promises.push(message.save());
            for (const member of channel.members) {
                rabbitMq.messageChannel.publish("messages", member.userId.toString(), jsonMessage);
            }
            await Promise.all(promises);
            callback({ success: true, message: message.toJSON() });
        } catch (error) {
            callback({ success: false, errors: error });

        }
    }
}

export function getMessages(io: SocketIOServer, socket: Socket, rabbitMq: RabbitMQ) {
    return async (payload: any, callback: any) => {
        if (typeof callback !== "function" || rabbitMq === null) {
            return;
        }
        const payloadInstance = Object.assign(new Payload(), payload);
        const errors = await validate(payloadInstance);

        if (errors.length > 0) {
            console.error("Validation errors", errors);
            callback({ success: false, errors });
            return;
        }
    }
}