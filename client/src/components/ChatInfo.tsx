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
import moment from "moment"
import { useSocketContext } from "@/context/SocketContext"
import { useParams } from "react-router-dom"

export default function ChatInfo({}: {}) {
    const { user } = useAppSelector((state) => state.user)
    const { getGroup } = useSocketContext()
    const { chatId } = useParams()

    if (!chatId) return null

    const myUserId = user._id
    const group = getGroup(chatId)

    //if group is not found, return null
    if (!group) return null

    const admin = group.members.find((member) => member.role === "admin")

    return (
        <Dialog>
            <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                <Info className="h-5 w-5" />
                <span className="sr-only">More Options</span>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{group.name}</DialogTitle>
                    <DialogDescription>
                        Created on{" "}
                        {moment(group.createdAt).format("D MMMM YY, kk:mm") +
                            " by "}
                        <span className="font-semibold">
                            {admin?.user.name}
                        </span>
                    </DialogDescription>
                    {group._id}
                </DialogHeader>
                <div className="max-h-[350px] overflow-y-auto">
                    {group.members.map((member) => (
                        <div
                            key={member.user._id}
                            className="flex items-center gap-3 py-2 px-5"
                        >
                            <Avatar>
                                <AvatarImage
                                    alt={member.user.name}
                                    src={member.user.image}
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
                            <p className="text-gray-500 dark:text-gray-400 flex-1 text-right">
                                {member.user._id === admin?.user._id
                                    ? "Admin"
                                    : "Member"}
                            </p>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    {myUserId === admin?.user._id && (
                        <Button variant="outline">Add Member</Button>
                    )}
                    <Button variant="outline">Leave Group</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
