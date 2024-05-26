import {
    useState,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useCallback,
} from "react"
import toast from "react-hot-toast"
import { io, Socket } from "socket.io-client"
import { ReactNode } from "react"
import { useAppSelector } from "@/hooks"
import {
    MessageType,
    MyContactsType,
    MyGroupsType,
    ContactType,
    NewMessage,
} from "@/types"
import { useNavigate } from "react-router-dom"

interface SocketContextType {
    contacts: MyContactsType[]
    getMessages: (receiverId: string) => MessageType[] | undefined
    getContact: (contactId: string) => ContactType | undefined
    getGroup: (groupId: string) => MyGroupsType | undefined
    sendMessage: (receiverId: string, message: string) => void
    createGroup: (name: string, members: string[]) => Promise<string>
    allContactsAndGroups: ContactType[]
}

const SocketContext = createContext<SocketContextType>({
    contacts: [],
    getMessages: () => undefined,
    getContact: () => undefined,
    sendMessage: () => undefined,
    createGroup: () => Promise.reject(),
    getGroup: () => undefined,
    allContactsAndGroups: [],
})

const SocketContextProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [myContacts, setMyContacts] = useState<MyContactsType[]>([])
    const [myGroups, setMyGroups] = useState<MyGroupsType[]>([])
    const [messages, setMessages] = useState<Map<string, MessageType[]>>(
        new Map(),
    )
    const { loading, isAuthenticated, user } = useAppSelector(
        (state) => state.user,
    )

    const navigate = useNavigate()

    // console.log(myContacts)
    // console.log(myGroups)
    // console.log(messages)

    const getMessages = useCallback(
        (receiverId: string) => {
            return messages.get(receiverId) || undefined
        },
        [messages],
    )

    const allContactsAndGroups: ContactType[] = useMemo(() => {
        const contacts: ContactType[] = myContacts.map((contact) => ({
            _id: contact._id,
            name: contact.name,
            image: contact.image,
            isGroup: false,
            lastMessage: getMessages(contact._id)?.[0],
            createdAt: contact.createdAt,
        }))
        const groups: ContactType[] = myGroups.map((group) => ({
            _id: group._id,
            name: group.name,
            image: group.image,
            isGroup: true,
            lastMessage: getMessages(group._id)?.[0],
            createdAt: group.createdAt,
        }))
        return [...contacts, ...groups]
    }, [myContacts, myGroups])

    const saveMessage = useCallback((message: MessageType) => {
        setMessages((messageMap) => {
            messageMap.get(message.receiverId)?.push(message) ??
                messageMap.set(message.receiverId, [message])
            return messageMap
        })
    }, [])

    const sendMessage = useCallback(
        (receiverId: string, message: string) => {
            socket?.emit(
                "message:send",
                {
                    message,
                    receiverId,
                },
                (data: { success: boolean; msg: string }) => {
                    console.log(data)
                    if (!data.success) toast.error(data.msg)
                    else if (import.meta.env.DEV) toast.success("Message sent")
                },
            ) ?? toast.error("You are not connected to the server")
        },
        [socket, saveMessage],
    )

    const getGroup = useCallback(
        (groupId: string) => {
            return myGroups.find((group) => group._id === groupId)
        },
        [myGroups],
    )

    // const getContactFromServer = (contactId: string, isGroup: boolean) => {
    //     if (isGroup)
    //         socket?.emit("Contact:get", { contactId }, (data: any) => {
    //             if (!data.success) console.log(data.msg)
    //             else {
    //                 setMyContacts((prev) => [...prev, data.contact])
    //             }
    //         })
    //     else
    //         socket?.emit("Group:get", { groupId: contactId }, (data: any) => {
    //             if (!data.success) console.log(data.msg)
    //             else {
    //                 setMyGroups((prev) => [...prev, data.group])
    //             }
    //         })
    // }

    const getContact = useCallback(
        (contactId: string) => {
            return allContactsAndGroups.find(
                (contact) => contact._id === contactId,
            )
        },
        [allContactsAndGroups],
    )

    const getMemberFromGroup = useCallback(
        (group: MyGroupsType, memberId: string) => {
            const member = group.members.find(
                (member) => member.user._id === memberId,
            )
            return member?.user
        },
        [],
    )

    const createGroup = useCallback(
        (name: string, members: string[]): Promise<string> => {
            setMyGroups((prev) => [
                ...prev,
                {
                    _id: Math.random() * 1000 + "",
                    name,
                    image: "https://source.unsplash.com/random",
                    members: members.map((member) => ({
                        user: {
                            _id: member,
                            name: "Contact 1",
                            phoneNo: "9876543210",
                            image: "https://source.unsplash.com/random",
                            createdAt: new Date().toISOString(),
                        },
                        role: "member",
                    })),
                    createdAt: new Date().toISOString(),
                },
            ])
            return new Promise((resolve, reject) => {
                if (!socket) return reject("Socket not connected")
                socket.emit("Group:new", { name, members }, (data: any) => {
                    if (!data.success) {
                        console.log(data.msg)
                        reject(data.msg)
                    } else {
                        resolve(data.groupId)
                    }
                })
            })
        },
        [socket],
    )
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
                duration: 1000000,
            },
        )
    }

    useEffect(() => {
        if (loading || !isAuthenticated || !user.socketToken)
            return () => {
                socket?.disconnect()
                setMyContacts([])
                setMyGroups([])
                setMessages(() => new Map())
            }
        const socketConnection = io({
            autoConnect: false,
            auth: {
                token: user.socketToken,
            },
        })
        setSocket(() => socketConnection)
        const onConnect = () => {
            console.log("Socket connected")
        }
        const onConnect_error = (err: Error) => {
            if (import.meta.env.DEV) socketConnection.disconnect()
            toast.error(`Socket connection error: ${err.message}`)
            console.log(`connect_error due to ${err.message}`)
        }
        const onDisconnect = (reason: Socket.DisconnectReason) => {
            console.log(`socket disconnected due to ${reason}`)
        }
        const onNewMessage = async (message: NewMessage) => {
            console.log("New message", message)
            if (message.isGroup) {
                toastMessage(message, message.receiver, message.sender)
            } else {
                toastMessage(message, message.sender)
            }
            saveMessage(message)
        }
        const onConnectionSuccess = (data: {
            success: boolean
            msg: string
            contacts: MyContactsType[]
            groups: MyGroupsType[]
            messages: MessageType[]
        }) => {
            console.log("Connection success")
            console.log(data)
            setMyGroups(data.groups)
            setMyContacts(data.contacts)
            const messageMap = new Map<string, MessageType[]>()
            data.messages.forEach((message) => {
                messageMap.has(message.receiverId)
                    ? messageMap.get(message.receiverId)?.push(message)
                    : messageMap.set(message.receiverId, [message])
            })

            setMessages(messageMap)
            socketConnection.on("message:new", onNewMessage)
        }

        socketConnection.connect()
        socketConnection.on("connect", onConnect)
        socketConnection.on("connect_error", onConnect_error)
        socketConnection.on("disconnect", onDisconnect)

        socketConnection.on("connection:success", onConnectionSuccess)

        return () => {
            socketConnection.close()
            socketConnection.disconnect()
            setMyContacts([])
            setMyGroups([])
            setMessages(() => new Map())
        }
    }, [loading, isAuthenticated, user.socketToken])

    return (
        <SocketContext.Provider
            value={{
                contacts: myContacts,
                getGroup,
                getMessages,
                getContact,
                sendMessage,
                createGroup,
                allContactsAndGroups,
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
