import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Phone, Video, Paperclip, Send, ArrowLeft } from "lucide-react"
import { useEffect, useRef } from "react"
import EmojiPicker from "../components/EmojiPicker"
import ChatInfo from "./ChatInfo"
import { useSocketContext } from "@/context/SocketContext"
import { ContactType, MessageType } from "@/types"
import { useAppSelector } from "@/hooks"
import moment from "moment"
import { useNavigate, useParams } from "react-router-dom"
import { Skeleton } from "@/components/ui/skeleton"

const nameInitials = (name: string) =>
    name
        .split(" ")
        .map((word) => word.substring(0, 1).toUpperCase())
        .join("")
        .substring(0, 2)

function HeaderSkeletonLoader() {
    return (
        <div className="flex h-[60px] items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
            <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-5" />
            </div>
        </div>
    )
}

function ChatProfileBar({ chatSelected }: { chatSelected: string }) {
    const navigate = useNavigate()

    const { getContact } = useSocketContext()
    const contact = getContact(chatSelected)

    if (!contact) return <HeaderSkeletonLoader />

    return (
        <div className="flex h-[60px] items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
            <div className="flex items-center gap-3">
                <Button
                    size="icon"
                    variant="ghost"
                    className="p-1"
                    onClick={() => navigate("/")}
                >
                    <ArrowLeft />
                </Button>
                <Avatar>
                    <AvatarImage alt="John Doe" src={contact.image} />
                    <AvatarFallback>
                        {nameInitials(contact.name)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <div className="font-medium">{contact.name}</div>
                    {/* <div className="text-sm text-gray-500 dark:text-gray-400">
                        Online
                    </div> */}
                </div>
            </div>
            <div className="flex items-center gap-0 sm:gap-2">
                <Button size="icon" variant="ghost">
                    <Video className="h-5 w-5" />
                    <span className="sr-only">Video Call</span>
                </Button>
                <Button size="icon" variant="ghost">
                    <Phone className="h-5 w-5" />
                    <span className="sr-only">Voice Call</span>
                </Button>
                <ChatInfo />
            </div>
        </div>
    )
}

function Messages({ chatSelected }: { chatSelected: string }) {
    const { user } = useAppSelector((state) => state.user)
    const myUserId = user._id

    const { getMessages, getContact } = useSocketContext()

    const messages = getMessages(chatSelected)

    const messageWithSender = messages?.map((message) => ({
        ...message,
        sender: getContact(message.senderId),
    }))

    return (
        <div className="max-h-[calc(100vh-120px)] flex-1 overflow-y-scroll p-4">
            <div className="grid gap-4">
                {messageWithSender &&
                    messageWithSender.map((message) =>
                        message.senderId === myUserId ? (
                            <MyMessage key={message._id} message={message} />
                        ) : (
                            <OtherMessage
                                key={message._id}
                                message={message}
                                sender={message.sender}
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
    sender: ContactType | undefined
}) {
    return (
        <div className="flex items-end gap-3">
            <Avatar>
                <AvatarImage alt="John Doe" src={sender?.image} />
                <AvatarFallback>
                    {sender ? nameInitials(sender.name) : "UK"}
                </AvatarFallback>
            </Avatar>
            <div className="max-w-[70%] space-y-2">
                <div className="rounded-lg bg-gray-100 p-3 text-sm dark:bg-gray-800">
                    {message.message}
                </div>
                <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                    {moment(message.createdAt).format("D MMMM YY, kk:mm")}
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
                    {moment(message.createdAt).format("D MMMM YY, kk:mm")}
                </div>
            </div>
        </div>
    )
}

function InputMessage({ chatSelected }: { chatSelected: string }) {
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        inputRef.current?.focus()
    }, [chatSelected])

    const handleAddEmoji = (emoji: string) => {
        if (inputRef.current) {
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

    const { sendMessage } = useSocketContext()

    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const msg = e.currentTarget.message.value
        if (!msg) return

        sendMessage(chatSelected, msg)
        e.currentTarget.message.value = ""
    }

    return (
        <form
            className="flex h-[60px] items-center justify-between border-t border-gray-200 px-4 dark:border-gray-800"
            onSubmit={handleSendMessage}
        >
            <Input
                className="flex-1 bg-transparent mr-2"
                placeholder="Type your message..."
                type="text"
                name="message"
                ref={inputRef}
                autoFocus
            />
            <Button size="icon" variant="ghost" type="button">
                <Paperclip className="h-6 w-6" />
                <span className="sr-only">Attach File</span>
            </Button>
            <EmojiPicker onChange={handleAddEmoji} />
            <Button size="icon" variant="ghost" type="submit">
                <Send className="h-6 w-6" />
                <span className="sr-only">Send Message</span>
            </Button>
        </form>
    )
}

export default function Chat() {
    const { chatId: chatSelected } = useParams()

    if (chatSelected === undefined)
        return (
            <img
                src="./random.jpg"
                alt="random"
                className="object-cover w-full h-full"
            />
        )

    return (
        <>
            <ChatProfileBar chatSelected={chatSelected} />
            <Messages chatSelected={chatSelected} />
            <InputMessage chatSelected={chatSelected} />
        </>
    )
}
