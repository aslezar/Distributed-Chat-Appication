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
} from "lucide-react"
import { useState } from "react"

function randomInt(a: number, b: number) {
    return Math.floor(Math.random() * (b - a + 1)) + a
}

const enum CallType {
    Missed = "Missed call",
    Incoming = "Incoming call",
    Outgoing = "Outgoing call",
}

const chatProfile = [
    {
        _id: "1",
        senderId: "1",
        name: "John Doe",
        message: "Hey, how's it going?",
        time: "2:30 PM",
        isGroup: false,
        profileImage: `https://picsum.photos/id/${randomInt(10, 1000)}/800/450`,
    },
    {
        _id: "2",
        senderId: "8",
        name: "Jane Smith",
        message: "Did you see the new design?",
        time: "11:45 AM",
        isGroup: false,
        profileImage: `https://picsum.photos/id/${randomInt(10, 1000)}/800/450`,
    },
    {
        _id: "3",
        senderId: "1",
        name: "Design Team",
        message: "New design review at 3pm",
        time: "9:00 AM",
        isGroup: true,
        senderName: "John Doe",
        profileImage: `https://picsum.photos/id/${randomInt(10, 1000)}/800/450`,
    },
    {
        _id: "4",
        senderId: "8",
        name: "Design Team",
        message: "New design review at 3pm. I'll be there!",
        time: "9:00 AM",
        isGroup: true,
        senderName: "John Doe",
        profileImage: `https://picsum.photos/id/${randomInt(10, 1000)}/800/450`,
    },
]

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
    profile,
    selectChat,
}: {
    profile: (typeof chatProfile)[0]
    selectChat: () => void
}) {
    const myId = "1"
    return (
        <button
            className="flex items-center gap-3 rounded-md bg-gray-100 p-3 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            onClick={selectChat}
        >
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
                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {profile.senderId === myId ? (
                        <span className="font-semibold">You: </span>
                    ) : profile.isGroup ? (
                        <span className="font-semibold">
                            {profile.senderName}:{" "}
                        </span>
                    ) : null}
                    {profile.message}
                </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
                {profile.time}
            </div>
        </button>
    )
}

export default function ChatPage() {
    const [chatSelected, setChatSelected] = useState<null | string>(null)
    console.log(chatSelected)

    return (
        <div className="grid h-screen w-full grid-cols-[350px_1fr] bg-white dark:bg-gray-950">
            <div className="border-r border-gray-200 dark:border-gray-800">
                <div className="flex h-[75px] items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
                    <Link
                        className="flex items-center gap-2 font-semibold"
                        to="#"
                    >
                        <MessageCircle className="h-6 w-6" />
                        <span>Vibe Talk</span>
                    </Link>
                    <div className="flex gap-2">
                        <AddChat />
                        <ViewProfileButton />
                    </div>
                </div>
                <Tabs
                    className="h-[calc(100%-75px)] w-full"
                    defaultValue="chat"
                >
                    <TabsList className="flex border-b">
                        <TabsTrigger
                            className="flex-1 py-3 text-center"
                            value="chat"
                        >
                            Chat
                        </TabsTrigger>
                        <TabsTrigger
                            className="flex-1 py-3 text-center"
                            value="calls"
                        >
                            Calls
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent className="h-full overflow-auto" value="chat">
                        <div className="grid gap-2 p-4">
                            {chatProfile.map((profile) => (
                                <ChatProfile
                                    key={profile._id}
                                    profile={profile}
                                    selectChat={() =>
                                        setChatSelected(profile._id)
                                    }
                                />
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent className="h-full overflow-auto" value="calls">
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
            <Chat chatSelected={chatSelected} />
        </div>
    )
}
