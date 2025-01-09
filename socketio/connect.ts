import { Socket, Server as SocketIOServer } from "socket.io"
import { createChat, createGroup, disconnect, getChannels, getServerName, sendMessage } from "../controllers/message"
import { EventsEnum } from "../enums"
import { RabbitMQ } from "../rabbitmq"
const serverName = process.env.SERVER_NAME as string

const onConnection = async (io: SocketIOServer, socket: Socket, rabbitMq: RabbitMQ) => {

    console.log("Connected: Socket %s UserId %s ", socket.id, socket.user.userId)

    socket.join(socket.user.userId.toString())
    rabbitMq.messageChannel.bindQueue(serverName, "messages", socket.user.userId.toString())

    socket.on(EventsEnum.NewMessage, sendMessage(io, socket, rabbitMq))
    socket.on(EventsEnum.NewGroup, createGroup(io, socket, rabbitMq));
    socket.on(EventsEnum.NewChat, createChat(io, socket, rabbitMq));
    socket.on(EventsEnum.GetChannels, getChannels(io, socket));
    socket.on(EventsEnum.GetServerInfo, getServerName(io, socket));

    socket.on("disconnect", disconnect(io, socket, rabbitMq))
}
export default onConnection;