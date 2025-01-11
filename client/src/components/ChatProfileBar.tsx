import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/hooks"
import { MyChannelsType } from "@/types"
import { ArrowLeft, Phone, Video } from "lucide-react"
import { useNavigate } from "react-router-dom"
import ChatInfo from "./ChatInfo"

const nameInitials = (name: string) =>
    name
        .split(" ")
        .map((word) => word.substring(0, 1).toUpperCase())
        .join("")
        .substring(0, 2)

export default function ChatProfileBar({
    channel,
}: {
    channel: MyChannelsType
}) {
    const navigate = useNavigate()
    const myUserId = useAppSelector((state) => state.user.user._id)

    if (channel.isGroup) {
        return (
            <div className="flex h-[60px] items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800 w-full">
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
                        <AvatarImage alt="John Doe" src={channel.groupImage} />
                        <AvatarFallback>
                            {nameInitials(channel.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{channel.name}</div>
                        {/* <div className="text-sm text-gray-500 dark:text-gray-400">
                            Online
                        </div> */}
                    </div>
                </div>
                <div className="flex items-center gap-0 sm:gap-2">
                    {/* <Button size="icon" variant="ghost">
                        <Video className="h-5 w-5" />
                        <span className="sr-only">Video Call</span>
                    </Button>
                    <Button size="icon" variant="ghost">
                        <Phone className="h-5 w-5" />
                        <span className="sr-only">Voice Call</span>
                    </Button> */}
                    <ChatInfo channel={channel} myUserId={myUserId} />
                </div>
            </div>
        )
    }
    const otherMember = channel.members.find(
        (m) => m.userId._id !== myUserId,
    )?.userId
    if (!otherMember) return null
    return (
        <div className="flex h-[60px] items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800 w-full">
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
                    <AvatarImage
                        alt={otherMember.name}
                        src={otherMember.image}
                    />
                    <AvatarFallback>
                        {nameInitials(otherMember.name)}
                    </AvatarFallback>
                </Avatar>

                <div>
                    <div className="font-medium">{otherMember.name}</div>
                    {/* <div className="text-sm text-gray-500 dark:text-gray-400">
                        Online
                    </div> */}
                </div>
            </div>
            {/* <div className="flex items-center gap-0 sm:gap-2">
                <Button size="icon" variant="ghost">
                    <Video className="h-5 w-5" />
                    <span className="sr-only">Video Call</span>
                </Button>
                <Button size="icon" variant="ghost">
                    <Phone className="h-5 w-5" />
                    <span className="sr-only">Voice Call</span>
                </Button>
            </div> */}
        </div>
    )
}
