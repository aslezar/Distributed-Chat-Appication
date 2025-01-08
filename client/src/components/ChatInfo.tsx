import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { MyChannelsType } from "@/types"
import { Info } from "lucide-react"
import moment from "moment"

export default function ChatInfo({
    channel,
    myUserId,
}: {
    channel: MyChannelsType
    myUserId: string
}) {
    if (!channel.isGroup) return null

    return (
        <Dialog>
            <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                <Info className="h-5 w-5" />
                <span className="sr-only">More Options</span>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{channel.name}</DialogTitle>
                    <DialogDescription>
                        Created on{" "}
                        {moment(channel.createdAt).format("D MMMM YY, kk:mm")}
                    </DialogDescription>
                    {channel._id}
                </DialogHeader>
                <div className="max-h-[350px] overflow-y-auto">
                    {channel.members.map(({ role, userId: user }) => (
                        <div
                            key={user._id}
                            className="flex items-center gap-3 py-2 px-5"
                        >
                            <Avatar>
                                <AvatarImage alt={user.name} src={user.image} />
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p>{user.name}</p>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    {user.phoneNo}
                                </p>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 flex-1 text-right">
                                {role === "admin" ? "Admin" : "Member"}
                            </p>
                        </div>
                    ))}
                </div>
                <DialogFooter>
                    {channel.members.some((m) => m.userId._id === myUserId) && (
                        <Button variant="outline" disabled>
                            Add Member
                        </Button>
                    )}
                    <Button variant="outline">Leave Group</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
