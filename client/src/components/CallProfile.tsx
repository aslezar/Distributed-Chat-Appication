import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CallsProfileType, CallType } from "@/types"
import {
    Phone,
    PhoneIncoming,
    PhoneMissed,
    PhoneOutgoing,
    Video,
} from "lucide-react"

export default function CallProfile({
    profile,
}: {
    profile: CallsProfileType
}) {
    return (
        <div className="flex items-center gap-3 rounded-md p-3 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700">
            <Avatar>
                <AvatarImage alt={profile.name} src={profile.profileImage} />
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
