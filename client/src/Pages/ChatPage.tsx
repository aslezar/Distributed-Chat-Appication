import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import ViewProfileButton from "../components/ViewProfileButton"
import AddChat from "../components/AddChat"
import Chat from "../components/Chat"
import { MessageCircle, Search } from "lucide-react"
import { useState } from "react"

const chatProfile = [
    {
        _id: "1",
        name: "John Doe",
        message: "Hey, how's it going?",
        time: "2:30 PM",
        profileImage: "/placeholder-avatar.jpg",
    },
    {
        _id: "2",
        name: "Jane Smith",
        message: "Did you see the new design?",
        time: "11:45 AM",
        profileImage: "/placeholder-avatar.jpg",
    },
    {
        _id: "3",
        name: "Design Team",
        message: "New design review at 3pm",
        time: "9:00 AM",
        profileImage: "/placeholder-avatar.jpg",
    },
]

const callsProfile = [
    {
        _id: "1",
        name: "John Doe",
        type: "Missed call",
        time: "2:30 PM",
        profileImage: "/placeholder-avatar.jpg",
    },
    {
        _id: "2",
        name: "Jane Smith",
        type: "Incoming call",
        time: "11:45 AM",
        profileImage: "/placeholder-avatar.jpg",
    },
    {
        _id: "3",
        name: "Design Team",
        type: "Incoming call",
        time: "9:00 AM",
        profileImage: "/placeholder-avatar.jpg",
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
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {profile.type}
                </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
                {profile.time}
            </div>
        </div>
    )
}

function ChatProfile({ profile }: { profile: (typeof chatProfile)[0] }) {
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
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {profile.message}
                </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
                {profile.time}
            </div>
        </div>
    )
}

export default function ChatPage() {
    const [chatSelected, setChatSelected] = useState(0)
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
            <Chat />
        </div>
    )
}
