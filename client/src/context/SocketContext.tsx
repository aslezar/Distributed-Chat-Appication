import { useState, createContext, useContext, useEffect } from "react"
import toast from "react-hot-toast"
import { io, Socket } from "socket.io-client"
import { ReactNode } from "react"
import { useAppDispatch, useAppSelector } from "../hooks"
import { handleNewChannel, handleNewMessage } from "@/features/userSlice"
import { ChannelType, MemberType, MessageType } from "@/types"

const SocketContext = createContext<any>(null)

const SocketContextProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const { loading, isAuthenticated, user } = useAppSelector(
        (state) => state.user,
    )

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (loading || !isAuthenticated)
            return () => {
                socket?.disconnect()
            }
        const socketConnection = io({
            autoConnect: false,
            auth: {
                token: user?.socketToken,
            },
        })
        setSocket(() => socketConnection)
        socketConnection.connect()
        socketConnection.on("connect", () => {
            console.log("socket connected")
        })
        socketConnection.on("connect_error", (err) => {
            if (import.meta.env.DEV) socketConnection.disconnect()
            toast.error(`Socket connection error: ${err.message}`)
            console.log(`connect_error due to ${err.message}`)
        })
        socketConnection.on("disconnect", (reason) => {
            console.log(`socket disconnected due to ${reason}`)
        })

        socketConnection.on("channel:newMessage", (data) => {
            console.log(data)
            dispatch(handleNewMessage(data))
        })

        socketConnection.on("channel:new", (data) => {
            console.log(data)
            const channel = data.channel as ChannelType
            const members = data.members as MemberType[]
            socketConnection.emit(
                "Channel:joinNew",
                { channelId: data.channel._id },
                (data: any) => !data.success && console.log(data.msg),
            )
            dispatch(
                handleNewChannel({
                    _id: channel._id,
                    isGroup: channel.isGroup,
                    groupProfile: channel.groupProfile,
                    createdAt: channel.createdAt,
                    lastMessage: undefined,
                    members: members,
                }),
            )
        })

        return () => {
            socketConnection.close()
            socketConnection.disconnect()
        }
    }, [loading, isAuthenticated])

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    )
}
const useSocketContext = () => {
    return useContext(SocketContext)
}

export { SocketContext, SocketContextProvider, useSocketContext }
