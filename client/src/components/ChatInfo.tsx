import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"
import { useAppSelector } from "@/hooks"
import { MemberType, ChannelType } from "@/types"
import moment from "moment"

export default function ChatInfo({
    channel,
    members,
}: {
    channel: ChannelType | null
    members: Map<MemberType["_id"], MemberType>
}) {
    const { user } = useAppSelector((state) => state.user)
    if (!user) return null
    const myId = user.userId
    // console.log(myId, channel, members)

    const membersArray = Array.from(members.values())
    const adminMember = membersArray.find((m) => m.role === "admin")

    return (
        <Dialog>
            <DialogTrigger>
                <Info className="h-5 w-5" />
                <span className="sr-only">More Options</span>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{channel?.groupProfile.groupName}</DialogTitle>
                    <DialogDescription>
                        Created on{" "}
                        {moment(channel?.createdAt).format("D MMMM YY, kk:mm") +
                            " by "}
                        <span className="font-semibold">
                            {adminMember?.user.name}
                        </span>
                    </DialogDescription>
                </DialogHeader>
                {membersArray.map((member) => (
                    <div
                        key={member.user._id}
                        className="flex items-center gap-3 p-2"
                    >
                        <Avatar>
                            <AvatarImage
                                alt={member.user.name}
                                src={member.user.profileImage}
                            />
                            <AvatarFallback>
                                {member.user.name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p>{member.user.name}</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {member.user.phoneNo}
                            </p>
                        </div>
                        {/* //in the end, we will show the admin badge */}
                        <p className="text-gray-500 dark:text-gray-400 flex-1 text-right">
                            {member._id === adminMember?._id
                                ? "Admin"
                                : "Member"}
                        </p>
                    </div>
                ))}
                <DialogFooter>
                    {myId === adminMember?._id && (
                        <Button variant="outline">Add Member</Button>
                    )}
                    <Button variant="outline">Leave Group</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
