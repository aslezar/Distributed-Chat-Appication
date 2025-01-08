import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useSocketContext } from "@/context/SocketContext"
import { Paperclip, Send } from "lucide-react"
import { useEffect, useRef } from "react"
import EmojiPicker from "../components/EmojiPicker"
import { MyChannelsType } from "@/types"

export default function InputMessage({ channel }: { channel: MyChannelsType }) {
    const inputRef = useRef<HTMLInputElement>(null)
    const { sendMessage } = useSocketContext()

    useEffect(() => {
        inputRef.current?.focus()
    }, [channel])

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
            // inputRef.current.focus()
        }
    }

    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()

        const msg = e.currentTarget.message.value
        if (!msg) return

        sendMessage(channel._id, msg)
        e.currentTarget.message.value = ""
        inputRef.current?.focus()
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
            {/* <Button size="icon" variant="ghost" type="button">
                <Paperclip className="h-6 w-6" />
                <span className="sr-only">Attach File</span>
            </Button> */}
            <EmojiPicker onChange={handleAddEmoji} />
            <Button size="icon" variant="ghost" type="submit">
                <Send className="h-6 w-6" />
                <span className="sr-only">Send Message</span>
            </Button>
        </form>
    )
}
