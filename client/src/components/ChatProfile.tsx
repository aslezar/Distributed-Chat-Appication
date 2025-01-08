import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppSelector } from "@/hooks"
import { MyChannelsType } from "@/types"
import { NavLink } from "react-router-dom"

const nameInitials = (name: string) =>
    name
        .split(" ")
        .map((word) => word.substring(0, 1).toUpperCase())
        .join("")
        .substring(0, 2)

export default function ChatProfile({ channel }: { channel: MyChannelsType }) {
    const { user } = useAppSelector((state) => state.user)
    // const { getContact } = useSocketContext()
    const myUserId = user._id

    if (channel.isGroup) {
        return (
            <NavLink
                className="flex items-center gap-3 rounded-md p-3 transition-colors hover:bg-gray-200  dark:hover:bg-gray-700"
                to={`/chat/${channel._id}`}
            >
                <Avatar>
                    <AvatarImage alt={channel.name} src={channel?.groupImage} />
                    <AvatarFallback>
                        {nameInitials(channel.name)}
                    </AvatarFallback>
                </Avatar>
                {/* <div className="flex-1 text-left">
                    <div className="font-medium">{channel.name}</div>
                    {channel.lastMessage && lastMsgSender && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {lastMsgSender._id === myUserId ? (
                                <span className="font-semibold">You: </span>
                            ) : channel.isGroup ? (
                                <span className="font-semibold">
                                    {lastMsgSender.name.split(" ")[0] + ": "}
                                </span>
                            ) : null}
                            {channel.lastMessage.message}
                        </div>
                    )}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {channel.lastMessage
                        ? moment(channel.lastMessage.createdAt).fromNow()
                        : moment(channel.createdAt).fromNow()}
                </div> */}
            </NavLink>
        )
    }

    const otherMember = channel.members.find(
        (member) => member.userId._id !== myUserId,
    )?.userId
    if (!otherMember) return null

    return (
        <NavLink
            className="flex items-center gap-3 rounded-md p-3 transition-colors hover:bg-gray-200  dark:hover:bg-gray-700"
            to={`/chat/${channel._id}`}
        >
            <Avatar>
                <AvatarImage alt={otherMember.name} src={otherMember.name} />
                <AvatarFallback>
                    {nameInitials(otherMember.name)}
                </AvatarFallback>
            </Avatar>
            {/* <div className="flex-1 text-left">
                <div className="font-medium">{channel.name}</div>
                {channel.lastMessage && lastMsgSender && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {lastMsgSender._id === myUserId ? (
                            <span className="font-semibold">You: </span>
                        ) : channel.isGroup ? (
                            <span className="font-semibold">
                                {lastMsgSender.name.split(" ")[0] + ": "}
                            </span>
                        ) : null}
                        {channel.lastMessage.message}
                    </div>
                )}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
                {channel.lastMessage
                    ? moment(channel.lastMessage.createdAt).fromNow()
                    : moment(channel.createdAt).fromNow()}
            </div> */}
        </NavLink>
    )
}
