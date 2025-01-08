import CallProfile from "@/components/CallProfile"
import ChatProfile from "@/components/ChatProfile"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSocketContext } from "@/context/SocketContext"
import { CallsProfileType, CallType } from "@/types"
import { MessageCircle, MessageSquareText, Phone } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import AddChat from "../components/AddChat"
import Chat from "../components/Chat"
import ViewProfileButton from "../components/ViewProfileButton"

function randomInt(a: number, b: number) {
    return Math.floor(Math.random() * (b - a + 1)) + a
}

const callsProfile: CallsProfileType[] = [
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

export default function ChatPage() {
    const { chatId: chatSelected } = useParams()
    const { myChannels } = useSocketContext()

    const channels = myChannels

    return (
        <div className="grid h-dvh w-full sm:grid-cols-[350px_1fr] bg-white dark:bg-gray-950">
            <div
                className={`border-r border-gray-200 dark:border-gray-800 ${chatSelected === undefined ? "block" : "hidden sm:block"}`}
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
                        <AddChat />
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
                        <div className="grid gap-2 p-2">
                            {channels.map((channel) => (
                                <ChatProfile
                                    key={channel._id}
                                    channel={channel}
                                />
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent
                        className="max-h-[calc(100vh-130px)] flex-1 overflow-y-scroll"
                        value="calls"
                    >
                        <div className="grid gap-2 p-2">
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
            <div
                className={`flex-col h-dvh relative ${chatSelected === undefined ? "hidden sm:flex" : "flex"}`}
            >
                <Chat />
            </div>
        </div>
    )
}
