import { useAppSelector } from "@/hooks"
import { MyChannelsType } from "@/types"
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import { io, Socket } from "socket.io-client"

export enum EventsEnum {
    NewMessage = "message:new",
    NewGroup = "group:new",
    NewChat = "group:chat",
    GetChannels = "channels:get",
}
interface SuccessType<T> {
    data: T
    success: true
}

interface ErrorType {
    success: false
    errors: string[]
}

type SocketResponseType<T> = SuccessType<T> | ErrorType

interface SocketContextType {
    myChannels: MyChannelsType[]
    sendMessage: (channelId: string, message: string) => void
    selectedChannel: MyChannelsType | null
}

const SocketContext = createContext<SocketContextType>({
    myChannels: [],
    sendMessage: () => undefined,
    selectedChannel: null,
})

const SocketContextProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [myChannels, setMyChannels] = useState<MyChannelsType[]>([])
    const [selectedChannel, setSelectedChannel] =
        useState<MyChannelsType | null>(null)

    const { loading, isAuthenticated, user } = useAppSelector(
        (state) => state.user,
    )

    const navigate = useNavigate()
    const { chatId } = useParams()

    useEffect(() => {
        if (!chatId) return
        console.log(chatId)

        const channel = myChannels.find((channel) => channel._id === chatId)
        if (!channel) return navigate("/")

        setSelectedChannel(() => channel)
    }, [chatId])

    useEffect(() => {
        if (loading || !isAuthenticated || !user.socketToken)
            return () => {
                socket?.disconnect()
                setMyChannels([])
            }
        const socketConnection = io({
            autoConnect: false,
            auth: {
                token: user.socketToken,
            },
        })
        setSocket(() => socketConnection)

        const onConnect = () => {
            // if (import.meta.env.DEV)
            console.log("Socket connected " + socketConnection.id)
            socketConnection.emit(
                EventsEnum.GetChannels,
                null,
                (data: SocketResponseType<MyChannelsType[]>) => {
                    if (data.success) {
                        setMyChannels(data.data)
                    } else {
                        console.log(data.errors)
                    }
                },
            )
        }
        const onReconnect = () => {
            // if (import.meta.env.DEV)
            toast.success(`Connected`, {
                id: "socket-connection",
            })
            console.log("Reconnected")
        }
        const onConnect_error = (err: Error) => {
            // if (import.meta.env.DEV) socketConnection.disconnect()
            // toast.error(`Disconnected`, {
            //     id: "socket-connection",
            // })
            console.log(`connect_error due to ${err.message}`)
        }
        const onDisconnect = (reason: Socket.DisconnectReason) => {
            console.log(`socket disconnected due to ${reason}`)
        }

        socketConnection.on("connect", onConnect)
        socketConnection.on("connect_error", onConnect_error)
        socketConnection.on("disconnect", onDisconnect)
        socketConnection.io.on("reconnect", onReconnect)

        socketConnection.connect()

        return () => {
            socketConnection.disconnect()
            setMyChannels([])
        }
    }, [loading, isAuthenticated, user.socketToken])

    useEffect(() => {
        if (!socket) return
        if (!socket.connected) {
            return
        }
        // socket.on("message:new", onNewMessage)
        // socket.on("new:group", onNewGroup)
        // socket.on("new:contact", onNewContact)
        // return () => {
        //     socket.off("message:new", onNewMessage)
        //     socket.off("new:group", onNewGroup)
        // }
    }, [socket, chatId])

    const sendMessage = (channelId: string, message: string) => {
        // not implemented yet
        console.log(channelId, message)
        socket?.emit(
            EventsEnum.NewMessage,
            { channelId, message },
            (data) => {},
        )
    }

    return (
        <SocketContext.Provider
            value={{
                myChannels,
                sendMessage,
                selectedChannel,
            }}
        >
            {children}
        </SocketContext.Provider>
    )
}
const useSocketContext = () => {
    return useContext(SocketContext)
}

export { SocketContext, SocketContextProvider, useSocketContext }

/**
 * 
    // Toast message
    const toastMessage = (
        message: MessageType,
        groupOrSender: MyContactsType,
        senderInGroup?: MyContactsType,
    ) => {
        toast.custom(
            (t) => (
                <div
                    className={`${
                        t.visible ? "animate-enter" : "animate-leave"
                    } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                >
                    <button
                        className="flex-1 w-0 p-4"
                        onClick={() => {
                            toast.dismiss(t.id)
                            navigate(`/chat/${groupOrSender._id}`)
                        }}
                    >
                        <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                                <img
                                    className="h-10 w-10 rounded-full"
                                    src={groupOrSender.image}
                                    alt={groupOrSender.name}
                                />
                            </div>
                            <div className="ml-3 flex-1 mr-auto text-left">
                                <p className="text-sm font-medium text-gray-900">
                                    {groupOrSender.name}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    {senderInGroup
                                        ? senderInGroup.name + ": "
                                        : ""}
                                    {message.message}
                                </p>
                            </div>
                        </div>
                    </button>
                    <div className="flex border-l border-gray-200">
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Close
                        </button>
                    </div>
                </div>
            ),
            {
                id: groupOrSender._id,
            },
        )
    }
 */
