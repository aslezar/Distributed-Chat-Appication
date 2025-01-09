import { instrument } from "@socket.io/admin-ui"
import { Server as HttpServer } from "http"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import { ServerOptions, Server as SocketIOServer } from "socket.io"
import { RabbitMQ } from "../utils/rabbitmq"
import { TempUserPayload, UserPayload } from "../types/express"
import onConnection from "./connect"
import { EventsEnum } from "../enums"

const serverName = process.env.SERVER_NAME as string

export let ioServer: SocketIOServer | null = null

export default (server: HttpServer, rabbitMq: RabbitMQ, options: Partial<ServerOptions>) => {
    if (ioServer) ioServer.close()

    const io = new SocketIOServer(server, options)
    ioServer = io

    if (process.env.NODE_ENV === "development")
        instrument(io, { auth: false, mode: "development" })

    io.use((socket, next) => {
        const { token } = socket.handshake.auth
        // const token = socket.handshake.headers.token as string

        try {
            if (!token || typeof token !== 'string') return next(new Error("Token not found"))
            const payload = jwt.verify(
                token,
                process.env.JWT_SOCKET_SECRET as jwt.Secret,
            ) as TempUserPayload

            const userPayload: UserPayload = {
                userId: new mongoose.Types.ObjectId(payload.userId),
            }
                ; (socket as any).user = userPayload
        } catch (error) {
            console.log(error);
            return next(new Error("Invalid token"))
        }
        next()
    })

    io.on("connection", async (socket) => await onConnection(io, socket, rabbitMq))
    rabbitMq.messageChannel.consume(serverName, (msg) => {
        console.log(`Recieved message: ${msg?.content.toString()}`);
        if (msg === null) return
        io.to(msg.fields.routingKey).emit(EventsEnum.Event, JSON.parse(msg.content.toString()))
        rabbitMq.messageChannel.ack(msg)
    })
}
