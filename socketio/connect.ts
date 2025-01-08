import { Socket, Server as SocketIOServer } from "socket.io"
import { RabbitMQ } from "../rabbitmq"
import { sendMessage } from "./socker-controller"

const serverName = process.env.SERVER_NAME as string

const onConnection = async (io: SocketIOServer, socket: Socket, rabbitMq: RabbitMQ) => {

    console.log("Connected: Socket %s UserId %s ", socket.id, socket.user.userId)

    socket.join(socket.user.userId.toString())
    rabbitMq.messageChannel.bindQueue(serverName, "messages", socket.user.userId.toString())

    socket.on("send", sendMessage(io, socket, rabbitMq))

    const disconnect = async (data: string) => {
        try {
            console.log(data);
            socket.removeAllListeners()
            await rabbitMq?.messageChannel.unbindQueue(serverName, "messages", socket.user.userId.toString())
            console.log("Disconnected: Socket %s UserId %s", socket.id, socket.user.userId)
        } catch (error) {
            console.log(error)
        }
    }
    socket.on("disconnect", disconnect)
}
export default onConnection;