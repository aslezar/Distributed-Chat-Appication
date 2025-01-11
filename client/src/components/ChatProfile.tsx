import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppSelector } from "@/hooks"
import { MyChannelsType } from "@/types"
import moment from "moment"
import { NavLink } from "react-router-dom"

const nameInitials = (name: string) =>
    name
        .split(" ")
        .map((word) => word.substring(0, 1).toUpperCase())
        .join("")
        .substring(0, 2)

export default function ChatProfile({ channel }: { channel: MyChannelsType }) {
    const myUserId = useAppSelector((state) => state.user.user._id)
    const lastMessage = channel.messages[channel.messages.length - 1]
    const lastSender =
        lastMessage &&
        channel.members.find(
            ({ userId }) => userId._id === lastMessage.senderId,
        )?.userId

    let { name, groupImage: image } = channel

    if (!channel.isGroup) {
        const otherMember = channel.members.find(
            (member) => member.userId._id !== myUserId,
        )?.userId
        if (!otherMember) {
            console.log("No other member found")
            return null
        }
        name = otherMember.name
        image = otherMember.image
    }
    return (
        <NavLink
            className="flex items-center gap-3 rounded-md p-3 transition-colors hover:bg-gray-200  dark:hover:bg-gray-700"
            to={`/chat/${channel._id}`}
        >
            <Avatar>
                <AvatarImage alt={name} src={image} />
                <AvatarFallback>{nameInitials(name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
                <div className="font-medium">{name}</div>
                {lastMessage && lastSender && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {lastSender._id === myUserId ? (
                            <span className="font-semibold">You: </span>
                        ) : channel.isGroup ? (
                            <span className="font-semibold">
                                {lastSender.name.split(" ")[0] + ": "}
                            </span>
                        ) : null}
                        {lastMessage.message.length > 18
                            ? lastMessage.message.substring(0, 18) + "..."
                            : lastMessage.message}
                    </div>
                )}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
                {lastMessage
                    ? moment(lastMessage.createdAt).fromNow()
                    : moment(channel.createdAt).fromNow()}
            </div>
        </NavLink>
    )
}
