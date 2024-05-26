import { Link } from "react-router-dom"
import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import ViewProfileButton from "../components/ViewProfileButton"
import AddChat from "../components/AddChat"
import Chat from "../components/Chat"
import {
    MessageCircle,
    PhoneIncoming,
    PhoneMissed,
    PhoneOutgoing,
    Video,
    Phone,
    MessageSquareText,
} from "lucide-react"
import { useState } from "react"
import { useAppSelector } from "@/hooks"
import { ChannelUserType } from "@/types"
import moment from "moment"

function randomInt(a: number, b: number) {
    return Math.floor(Math.random() * (b - a + 1)) + a
}

const enum CallType {
    Missed = "Missed call",
    Incoming = "Incoming call",
    Outgoing = "Outgoing call",
}

const callsProfile = [
    {
        _id: "1",
        name: "John Doe",
        type: CallType.Outgoing,
        time: "2:30 PM",
        profileImage: `https://picsum.photos/id/${randomInt(10, 1000)}/800/450`,
        isVideoCall: true,
    },
    {
        _id: "2",
        name: "Jane Smith",
        type: CallType.Missed,
        time: "11:45 AM",
        profileImage: `https://picsum.photos/id/${randomInt(10, 1000)}/800/450`,
        isVideoCall: false,
    },
    {
        _id: "3",
        name: "Design Team",
        type: CallType.Incoming,
        time: "9:00 AM",
        profileImage: `https://picsum.photos/id/${randomInt(10, 1000)}/800/450`,
        isVideoCall: true,
    },
]

function CallProfile({ profile }: { profile: (typeof callsProfile)[0] }) {
    return (
        <div className="flex items-center gap-3 rounded-md bg-gray-100 p-3 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
            <Avatar>
                <AvatarImage alt="John Doe" src={profile.profileImage} />
                <AvatarFallback>
                    {profile.name
                        .split(" ")
                        .map((word) => word.substring(0, 1).toUpperCase())
                        .join("")
                        .substring(0, 2)}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1">
                <div className="font-medium">John Doe</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    {
                        {
                            [CallType.Missed]: (
                                <PhoneMissed className="text-red-500 dark:text-red-400 h-4 w-4" />
                            ),
                            [CallType.Incoming]: (
                                <PhoneIncoming className="text-green-500 dark:text-green-400 h-4 w-4" />
                            ),
                            [CallType.Outgoing]: (
                                <PhoneOutgoing className="text-blue-500 dark:text-blue-400 h-4 w-4" />
                            ),
                        }[profile.type]
                    }
                    {profile.time}
                </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
                {profile.isVideoCall ? (
                    <Video className="h-4 w-4 text-green-500 dark:text-green-400" />
                ) : (
                    <Phone className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                )}
            </div>
        </div>
    )
}

function ChatProfile({
    channel,
    selectChat,
}: {
    channel: ChannelUserType
    selectChat: () => void
}) {
    const { user } = useAppSelector((state) => state.user)
    const myId = user?.userId

    const otherPerson = channel.members.find(
        (member) => member.user._id !== myId,
    )
    const avatarImage = channel.isGroup
        ? channel.groupProfile.groupImage
        : otherPerson?.user.profileImage

    const name = channel.isGroup
        ? channel.groupProfile.groupName
        : otherPerson?.user.name

    const messageSender = channel.members.find(
        (member) => member.user._id === (channel?.lastMessage?.senderId ?? ""),
    )
    return (
        <button
            className="flex items-center gap-3 rounded-md bg-gray-100 p-3 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            onClick={selectChat}
        >
            <Avatar>
                <AvatarImage alt="John Doe" src={avatarImage} />
                <AvatarFallback>
                    {name &&
                        name
                            .split(" ")
                            .map((word) => word.substring(0, 1).toUpperCase())
                            .join("")
                            .substring(0, 2)}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
                <div className="font-medium">{name}</div>
                {channel.lastMessage && messageSender && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {messageSender.user._id === myId ? (
                            <span className="font-semibold">You: </span>
                        ) : channel.isGroup ? (
                            <span className="font-semibold">
                                {messageSender.user.name.split(" ")[0] + ": "}
                            </span>
                        ) : null}
                        {channel.lastMessage ? channel.lastMessage.message : ""}
                    </div>
                )}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
                {channel.lastMessage
                    ? moment(channel.lastMessage.createdAt).fromNow()
                    : moment(channel.createdAt).fromNow()}
            </div>
        </button>
    )
}

export default function ChatPage() {
    const [chatSelected, setChatSelected] = useState<null | string>(null)

    const { user } = useAppSelector((state) => state.user)
    if (!user) return <div>You need to login</div>

    // console.log(user.channels)

    return (
        <div className="grid h-screen w-full sm:grid-cols-[350px_1fr] bg-white dark:bg-gray-950">
            <div
                className={`border-r border-gray-200 dark:border-gray-800 ${chatSelected === null ? "block" : "hidden sm:block"}`}
            >
                <div className="flex h-[75px] items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
                    <Link
                        className="flex items-center gap-2 font-semibold"
                        to="#"
                    >
                        <MessageCircle className="h-6 w-6" />
                        <span>Vibe Talk</span>
                    </Link>
                    <div className="flex gap-2">
                        <AddChat setChatSelected={setChatSelected} />
                        <ViewProfileButton />
                    </div>
                </div>
                <Tabs
                    className="max-h-[calc(100%-75px)] w-full flex flex-col"
                    defaultValue="chat"
                >
                    <TabsList className="h-[45px] flex rounded-none">
                        <TabsTrigger
                            className="flex-1 py-2 text-center gap-2"
                            value="chat"
                        >
                            <MessageSquareText className="h-4 w-4" />
                            Chat
                        </TabsTrigger>
                        <TabsTrigger
                            className="flex-1 py-2 text-center gap-2"
                            value="calls"
                        >
                            <Phone className="h-4 w-4" />
                            Calls
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent
                        className="max-h-[calc(100vh-130px)] flex-1 overflow-y-scroll"
                        value="chat"
                    >
                        <div className="grid gap-2 p-4">
                            {user.channels.map((profile) => (
                                <ChatProfile
                                    key={profile._id}
                                    channel={profile}
                                    selectChat={() =>
                                        setChatSelected(profile._id)
                                    }
                                />
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent
                        className="max-h-[calc(100vh-130px)] flex-1 overflow-y-scroll"
                        value="calls"
                    >
                        <div className="grid gap-2 p-4">
                            {callsProfile.map((profile) => (
                                <CallProfile
                                    key={profile._id}
                                    profile={profile}
                                />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
            <Chat
                chatSelected={chatSelected}
                setChatSelected={setChatSelected}
            />
        </div>
    )
}
