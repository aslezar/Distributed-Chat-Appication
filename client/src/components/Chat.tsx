import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Phone, Video, Paperclip, Send } from "lucide-react"
import { useRef, useState } from "react"
import EmojiPicker from "../components/EmojiPicker"
import ChatInfo from "./ChatInfo"

const msg = [
    {
        _id: "1",
        message: "Hey, how's it going?",
        time: "2:30 PM",
        sender: {
            _id: "1",
            name: "John Doe",
            avatar: "/placeholder-avatar.jpg",
        },
    },
    {
        _id: "2",
        message: "I'm doing great, thanks for asking!",
        time: "2:31 PM",
        sender: {
            _id: "2",
            name: "You",
            avatar: "/placeholder-avatar.jpg",
        },
    },
    {
        _id: "3",
        message: "Did you see the new design?",
        time: "2:32 PM",
        sender: {
            _id: "1",
            name: "John Doe",
            avatar: "/placeholder-avatar.jpg",
        },
    },
    {
        _id: "4",
        message: "Yes, I really like it! Great work.",
        time: "2:33 PM",
        sender: {
            _id: "2",
            name: "You",
            avatar: "/placeholder-avatar.jpg",
        },
    },
]

function ChatProfileBar() {
    return (
        <div className="flex h-[60px] items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage alt="John Doe" src="/placeholder-avatar.jpg" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                    <div className="font-medium">John Doe</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Online
                    </div>
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
                <Button size="icon" variant="ghost">
                    <ChatInfo />
                </Button>
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
            className="flex h-[60px] items-center justify-between border-t border-gray-200 px-4 dark:border-gray-800"
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
            <Button size="icon" variant="ghost" type="button">
                {/* <Smile className="h-5 w-5" />*/}
                <EmojiPicker onChange={handleAddEmoji} />
            </Button>
            <Button size="icon" variant="ghost" type="submit">
                <Send className="h-5 w-5" />
                <span className="sr-only">Send Message</span>
            </Button>
        </form>
    )
}

function Messages({ messages }: { messages: typeof msg }) {
    const myId = "1"

    return (
        <div className="flex-1 overflow-y-scroll p-4">
            <div className="grid gap-4">
                {messages.map((message) =>
                    message.sender._id === myId ? (
                        <MyMessage key={message._id} message={message} />
                    ) : (
                        <OtherMessage key={message._id} message={message} />
                    ),
                )}
            </div>
        </div>
    )
}

function OtherMessage({ message }: { message: (typeof msg)[0] }) {
    return (
        <div className="flex items-end gap-3">
            <Avatar>
                <AvatarImage alt="John Doe" src={message.sender.avatar} />
                <AvatarFallback>
                    {message.sender.name
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
                    {message.time}
                </div>
            </div>
        </div>
    )
}

function MyMessage({ message }: { message: (typeof msg)[0] }) {
    return (
        <div className="flex items-end gap-3 justify-end">
            <div className="max-w-[70%] space-y-2">
                <div className="rounded-lg bg-primary p-3 text-sm text-white">
                    {message.message}
                </div>
                <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                    {message.time}
                </div>
            </div>
        </div>
    )
}

export default function Chat({
    chatSelected,
}: {
    chatSelected: string | null
}) {
    const [messages, setMessages] = useState(msg)
    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const msg = e.currentTarget.message.value
        if (!msg) return
        setMessages((p) => [
            ...p,
            {
                _id: String(Math.random()),
                message: msg,
                time: new Date().toLocaleTimeString(),
                sender: {
                    _id: "1",
                    name: "You",
                    avatar: "/placeholder-avatar.jpg",
                },
            },
        ])
        console.log("Message Sent")
        try {
            e.currentTarget.message.value = ""
        } catch (error) {
            console.log(error)
        }
    }
    if (!chatSelected)
        return (
            <div className="flex flex-col max-h-full">
                {/* show random image from unsplash*/}
                <img
                    src="./random.jpg"
                    alt="random"
                    className="object-cover w-full h-full"
                />
            </div>
        )
    return (
        <div className="flex flex-col max-h-full">
            <ChatProfileBar />
            <Messages messages={messages} />
            <InputMessage handleSendMessage={handleSendMessage} />
        </div>
    )
}
