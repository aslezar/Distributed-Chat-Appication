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

const groupInfo = {
    name: "Design Team",
    members: [
        {
            _id: "1",
            name: "John Doe",
            avatar: "https://picsum.photos/id/1005/800/450",
            phoneNo: "+1234567890",
        },
        {
            _id: "2",
            name: "Jane Smith",
            avatar: "https://picsum.photos/id/1006/800/450",
            phoneNo: "+1234567890",
        },
        {
            _id: "3",
            name: "Alice",
            avatar: "https://picsum.photos/id/1007/800/450",
            phoneNo: "+1234567890",
        },
        {
            _id: "4",
            name: "Bob",
            avatar: "https://picsum.photos/id/1008/800/450",
            phoneNo: "+1234567890",
        },
    ],
    createdAt: "2021-09-01T00:00:00.000Z",
    admin: {
        _id: "1",
        name: "John Doe",
        avatar: "https://picsum.photos/id/1005/800/450",
    },
}

export default function ChatInfo() {
    const myId = "1"
    return (
        <Dialog>
            <DialogTrigger>
                <Info className="h-5 w-5" />
                <span className="sr-only">More Options</span>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{groupInfo.name}</DialogTitle>
                    <DialogDescription>
                        Created on{" "}
                        {new Date(groupInfo.createdAt).toDateString() + " by "}
                        <span className="font-semibold">
                            {groupInfo.admin.name}
                        </span>
                    </DialogDescription>
                </DialogHeader>
                {groupInfo.members.map((member) => (
                    <div
                        key={member._id}
                        className="flex items-center gap-3 p-2"
                    >
                        <Avatar>
                            <AvatarImage
                                alt={member.name}
                                src={member.avatar}
                            />
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p>{member.name}</p>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                {member.phoneNo}
                            </p>
                        </div>
                        {/* //in the end, we will show the admin badge */}
                        <p className="text-gray-500 dark:text-gray-400 flex-1 text-right">
                            {member._id === groupInfo.admin._id
                                ? "Admin"
                                : "Member"}
                        </p>
                    </div>
                ))}
                <DialogFooter>
                    {myId === groupInfo.admin._id && (
                        <Button variant="outline">Add Member</Button>
                    )}
                    <Button variant="outline">Leave Group</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
