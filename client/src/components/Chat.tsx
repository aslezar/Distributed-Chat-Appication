import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Phone, Video, Paperclip, Send, ArrowLeft } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import EmojiPicker from "../components/EmojiPicker"
import ChatInfo from "./ChatInfo"
import { useSocketContext } from "@/context/SocketContext"
import { MessageType, ChannelType, MemberType } from "@/types"
import toast from "react-hot-toast"
import { useAppSelector } from "@/hooks"

function ChatProfileBar({
    channel,
    members,
    setChatSelected,
}: {
    channel: ChannelType | null
    members: Map<MemberType["_id"], MemberType>
    setChatSelected: (id: string | null) => void
}) {
    const { user } = useAppSelector((state) => state.user)
    if (!user) return null

    if (!channel) return null

    //other user if it is not group
    const otherUser = Array.from(members.values()).find(
        (m) => m.user._id !== user.userId,
    )?.user

    const getNameInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word.substring(0, 1).toUpperCase())
            .join("")
            .substring(0, 2)
    }

    return (
        <div className="flex h-[60px] items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
            <div className="flex items-center gap-3">
                <Button
                    size="icon"
                    variant="ghost"
                    className="p-1"
                    onClick={() => setChatSelected(null)}
                >
                    <ArrowLeft />
                </Button>
                <Avatar>
                    <AvatarImage
                        alt="John Doe"
                        src={
                            channel.isGroup
                                ? channel.groupProfile.groupImage
                                : otherUser?.profileImage
                        }
                    />
                    <AvatarFallback>
                        {channel.isGroup
                            ? getNameInitials(channel.groupProfile.groupName)
                            : getNameInitials(otherUser?.name ?? "")}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <div className="font-medium">
                        {channel.isGroup
                            ? channel.groupProfile.groupName
                            : otherUser?.name}
                    </div>
                    {/* <div className="text-sm text-gray-500 dark:text-gray-400">
                        Online
                    </div> */}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost">
                    <Video className="h-5 w-5" />
                    <span className="sr-only">Video Call</span>
                </Button>
                <Button size="icon" variant="ghost">
                    <Phone className="h-5 w-5" />
                    <span className="sr-only">Voice Call</span>
                </Button>
                {
                    //if it is group then show the chat info button
                    channel.isGroup && (
                        <ChatInfo channel={channel} members={members} />
                    )
                }
            </div>
        </div>
    )
}

function InputMessage({
    handleSendMessage,
}: {
    handleSendMessage: (e: React.FormEvent<HTMLFormElement>) => void
}) {
    const inputRef = useRef<HTMLInputElement>(null)
    const handleAddEmoji = (emoji: string) => {
        if (inputRef.current) {
            console.log(inputRef.current.selectionStart)
            const value = inputRef.current.value
            const start = inputRef.current.selectionStart ?? 0
            const end = inputRef.current.selectionEnd ?? 0
            inputRef.current.value =
                value.substring(0, start) + emoji + value.substring(end)
            //focus at the end of the emoji
            inputRef.current.selectionStart = start + emoji.length
            inputRef.current.selectionEnd = start + emoji.length
            inputRef.current.focus()
        }
    }

    return (
        <form
            className="flex gap-2 h-[60px] items-center justify-between border-t border-gray-200 px-4 dark:border-gray-800"
            onSubmit={handleSendMessage}
        >
            <Input
                className="flex-1 bg-transparent"
                placeholder="Type your message..."
                type="text"
                name="message"
                ref={inputRef}
            />
            <Button size="icon" variant="ghost" type="button">
                <Paperclip className="h-5 w-5" />
                <span className="sr-only">Attach File</span>
            </Button>
            <EmojiPicker onChange={handleAddEmoji} />
            <Button size="icon" variant="ghost" type="submit">
                <Send className="h-5 w-5" />
                <span className="sr-only">Send Message</span>
            </Button>
        </form>
    )
}

function Messages({
    messages,
    members,
}: {
    messages: MessageType[]
    members: Map<MemberType["_id"], MemberType>
}) {
    const { user } = useAppSelector((state) => state.user)
    const myId = user?.userId

    return (
        <div className="flex-1 overflow-y-scroll p-4">
            <div className="grid gap-4">
                {messages.map((message) =>
                    message.senderId === myId ? (
                        <MyMessage key={message._id} message={message} />
                    ) : (
                        <OtherMessage
                            key={message._id}
                            message={message}
                            sender={members.get(message.senderId)?.user}
                        />
                    ),
                )}
            </div>
        </div>
    )
}

function OtherMessage({
    message,
    sender,
}: {
    message: MessageType
    sender: MemberType["user"] | undefined
}) {
    if (!sender) console.log("Sender not found")
    if (!sender) return null
    return (
        <div className="flex items-end gap-3">
            <Avatar>
                <AvatarImage alt="John Doe" src={sender.profileImage} />
                <AvatarFallback>
                    {sender.name
                        .split(" ")
                        .map((word) => word.substring(0, 1).toUpperCase())
                        .join("")
                        .substring(0, 2)}
                </AvatarFallback>
            </Avatar>
            <div className="max-w-[70%] space-y-2">
                <div className="rounded-lg bg-gray-100 p-3 text-sm dark:bg-gray-800">
                    {message.message}
                </div>
                <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                    {message.createdAt}
                </div>
            </div>
        </div>
    )
}

function MyMessage({ message }: { message: MessageType }) {
    return (
        <div className="flex items-end gap-3 justify-end">
            <div className="max-w-[70%] space-y-2">
                <div className="rounded-lg bg-primary p-3 text-sm text-white">
                    {message.message}
                </div>
                <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                    {message.createdAt}
                </div>
            </div>
        </div>
    )
}

export default function Chat({
    chatSelected,
    setChatSelected,
}: {
    chatSelected: string | null
    setChatSelected: (id: string | null) => void
}) {
    const [channel, setChannel] = useState<ChannelType | null>(null)
    const [messages, setMessages] = useState<MessageType[]>([])
    const [members, setMembers] = useState<Map<MemberType["_id"], MemberType>>(
        new Map(),
    )

    const { socket } = useSocketContext()
    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const msg = e.currentTarget.message.value
        if (!msg) return
        const cb = (data: any) => {
            console.log(data)
            if (data.success === false) return toast.error(data.msg)
            else {
                setMessages((p) => [...p, data.data as MessageType])
                console.log("Message Sent")
            }
        }
        socket.emit(
            "channel:chat",
            { message: msg, channelId: chatSelected },
            cb,
        )
        e.currentTarget.message.value = ""
    }
    useEffect(() => {
        if (!socket || chatSelected === null) return
        function handleJoinChannel(data: any) {
            if (data.success === false) return toast.error(data.msg)
            const channel = data.data.channel as ChannelType
            const messages = data.data.messages as MessageType[]
            const members = data.data.members as MemberType[]

            // console.log(channel)
            // console.log(messages)
            // console.log(members)

            setChannel(channel)
            setMessages((p) => {
                return [...p, ...messages].sort((a, b) => {
                    return (
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                    )
                })
            })
            setMembers(new Map(members.map((m) => [m.user._id, m])))
        }
        // function sendMessages(data: any) {
        //     console.log(data)
        //     setMessages((p) => [...p, data.data])
        // }

        socket.emit(
            "channel:join",
            { channelId: chatSelected },
            handleJoinChannel,
        )
        // socket.on("channel:chat", sendMessages)

        return () => {
            socket.off("message")
            setChannel(null)
            setMessages([])
            setMembers(new Map())
        }
    }, [socket, chatSelected])
    return (
        <div
            className={`flex-col max-h-full ${chatSelected === null ? "hidden sm:flex" : "flex"}`}
        >
            {chatSelected === null ? (
                <img
                    src="./random.jpg"
                    alt="random"
                    className="object-cover w-full h-full"
                />
            ) : (
                <>
                    <ChatProfileBar
                        setChatSelected={setChatSelected}
                        channel={channel}
                        members={members}
                    />
                    <Messages messages={messages} members={members} />
                    <InputMessage handleSendMessage={handleSendMessage} />
                </>
            )}
        </div>
    )
}
