import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppSelector } from "@/hooks"
import { MessageType, MyChannelsType, MyContactType } from "@/types"
import moment from "moment"
import { useEffect, useRef } from "react"

const nameInitials = (name: string) =>
    name
        .split(" ")
        .map((word) => word.substring(0, 1).toUpperCase())
        .join("")
        .substring(0, 2)

export default function Messages({ channel }: { channel: MyChannelsType }) {
    const myUserId = useAppSelector((state) => state.user.user._id)
    const dummyDivRef = useRef<HTMLDivElement>(null)
    const messages = channel.messages

    useEffect(() => {
        if (dummyDivRef.current) {
            dummyDivRef.current.scrollIntoView({ behavior: "instant" })
        }
    }, [channel.messages])

    return (
        <ScrollArea className="max-h-[calc(100dvh-120px)] flex-1 p-4 flex flex-col gap-4">
            {messages.map((message) =>
                message.senderId === myUserId ? (
                    <MyMessage key={message._id} message={message} />
                ) : (
                    <OtherMessage
                        key={message._id}
                        message={message}
                        sender={
                            channel.members.find(
                                ({ userId }) => userId._id === message.senderId,
                            )?.userId
                        }
                    />
                ),
            )}
            <div ref={dummyDivRef} />
        </ScrollArea>
    )
}

function OtherMessage({
    message,
    sender,
}: {
    message: MessageType
    sender: MyContactType | undefined
}) {
    return (
        <div className="flex items-end gap-3">
            <Avatar>
                <AvatarImage alt={sender?.name || "UK"} src={sender?.image} />
                <AvatarFallback>
                    {sender ? nameInitials(sender.name) : "UK"}
                </AvatarFallback>
            </Avatar>
            <div className="max-w-[70%] space-y-2">
                <div className="rounded-lg bg-gray-100 p-3 text-sm dark:bg-gray-800">
                    {message.message}
                </div>
                <div className="text-left text-xs text-gray-500 dark:text-gray-400">
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
