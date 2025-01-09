import toastMessage from "@/components/ToastMessage"
import { useAppSelector } from "@/hooks"
import {
    MessageType,
    MyChannelsType,
    SocketContextType,
    SocketResponseType,
    SocketsEventsEnum,
} from "@/types"
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import { io, Socket } from "socket.io-client"

const SocketContext = createContext<SocketContextType>({
    server: null,
    myChannels: [],
    allContacts: [],
    myContacts: [],
    sendMessage: () => undefined,
    selectedChannel: null,
    createNewChat: () => Promise.resolve(""),
    createGroupChat: () => Promise.resolve(""),
})

const SocketContextProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [server, setServer] = useState<string | null>(null)
    const [myChannels, setMyChannels] = useState<MyChannelsType[]>([])
    const [selectedChannel, setSelectedChannel] =
        useState<MyChannelsType | null>(null)

    const { loading, isAuthenticated, user } = useAppSelector(
        (state) => state.user,
    )

    const navigate = useNavigate()
    const { chatId } = useParams()

    const allContacts = useMemo(() => {
        return Array.from(
            new Map(
                myChannels
                    .flatMap((channel) => channel.members)
                    .filter((member) => member._id !== user._id)
                    .map((member) => [member.userId._id, member.userId]),
            ).values(),
        )
    }, [myChannels, user._id])

    const myContacts = useMemo(() => {
        return Array.from(
            new Map(
                myChannels
                    .filter((channel) => !channel.isGroup)
                    .flatMap((channel) => channel.members)
                    .filter((member) => member._id !== user._id)
                    .map((member) => [member.userId._id, member.userId]),
            ).values(),
        )
    }, [myChannels, user._id])

    useEffect(() => {
        const channel =
            myChannels.find((channel) => channel._id === chatId) || null
        setSelectedChannel(() => channel)
        if (!channel) navigate("/")
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
                SocketsEventsEnum.GetServerInfo,
                null,
                (data: SocketResponseType<string>) => {
                    if (data.success) {
                        console.log(data.data)
                        setServer(data.data)
                    } else {
                        console.log(data.errors)
                    }
                },
            )
            socketConnection.emit(
                SocketsEventsEnum.GetChannels,
                null,
                (data: SocketResponseType<MyChannelsType[]>) => {
                    if (data.success) {
                        console.log(data.data)
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
        socketConnection.on("reconnect", onReconnect)

        socketConnection.connect()

        return () => {
            setServer(null)
            socketConnection.disconnect()
            setMyChannels([])
        }
    }, [loading, isAuthenticated, user.socketToken])

    const handleEvent = useCallback(
        (data: { event: string; data: any }) => {
            console.log(data)

            switch (data.event) {
                case SocketsEventsEnum.NewMessage: {
                    const message = data.data as MessageType

                    const channel = myChannels.find(
                        (channel) => channel._id === message.channelId,
                    )
                    // const sen
                    if (!channel) {
                        console.log("Channel not found")
                        return
                    }
                    // save message
                    channel.messages?.push(message)
                    setMyChannels(() => [...myChannels])
                    if (message.senderId === user._id) return
                    if (selectedChannel?._id === message.channelId) return
                    console.log("Showing toast msg")

                    toastMessage(message, channel)
                    break
                }
                case SocketsEventsEnum.NewChat:
                case SocketsEventsEnum.NewGroup: {
                    console.log("New chat")

                    const channel = data.data as MyChannelsType
                    setMyChannels((prev) => [...prev, channel])
                    break
                }
                default:
                    break
            }
        },
        [myChannels, allContacts],
    )
    useEffect(() => {
        if (!socket) return

        socket.on(SocketsEventsEnum.Event, handleEvent)
        if (import.meta.env.DEV) {
            socket.onAny((event, ...args) => {
                console.log(event, args)
            })
            socket.onAnyOutgoing((event, ...args) => {
                console.log(event, args)
            })
        }

        return () => {
            socket.off(SocketsEventsEnum.Event, handleEvent)
            socket.offAny()
            socket.offAnyOutgoing()
        }
    }, [socket, user._id, myChannels])

    const EventHandler = <T,>(event: SocketsEventsEnum, payload: any) => {
        return new Promise<T>((resolve, reject) => {
            if (!socket) return reject(["Socket not connected"])
            socket.emit(event, payload, (data: SocketResponseType<T>) => {
                if (data.success) {
                    resolve(data.data)
                } else {
                    reject(data.errors)
                }
            })
        })
    }

    const sendMessage = (channelId: string, message: string) => {
        return EventHandler<String>(SocketsEventsEnum.NewMessage, {
            channelId,
            message,
        })
    }

    const createNewChat = (member: string) => {
        return EventHandler<String>(SocketsEventsEnum.NewChat, { member })
    }

    const createGroupChat = (name: string, members: string[]) => {
        return EventHandler<String>(SocketsEventsEnum.NewGroup, {
            name,
            members,
        })
    }

    return (
        <SocketContext.Provider
            value={{
                server,
                myChannels,
                allContacts,
                myContacts,
                sendMessage,
                selectedChannel,
                createNewChat,
                createGroupChat,
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
