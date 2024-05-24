import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { UserRoundPlus } from "lucide-react"

export default function AddChat() {
    return (
        <Dialog>
            <DialogTrigger>
                <UserRoundPlus className="h-6 w-6" />
                <span className="sr-only">Add Chat</span>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Chat</DialogTitle>
                    <DialogDescription>
                        {/* <CardHeader className="flex flex-col items-center gap-4 p-6">
                            <Avatar className="h-24 w-24">
                                <AvatarImage
                                    alt="Profile Photo"
                                    src="/placeholder-avatar.jpg"
                                />
                                <AvatarFallback>JP</AvatarFallback>
                            </Avatar>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                    <Camera className="mr-2 h-4 w-4" />
                                    Change
                                </Button>
                                <Button size="sm" variant="outline">
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                                <ModeToggle />
                            </div>
                            <div className="space-y-1 text-center">
                                <Input
                                    className="text-xl font-semibold"
                                    defaultValue="Jared Palmer"
                                    id="name"
                                />
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    jared@example.com
                                </p>
                            </div>
                        </CardHeader>
                        <CardFooter className="flex justify-end p-4 gap-4">
                            <Button variant="outline">Log Out</Button>
                            <Button>Save Changes</Button>
                        </CardFooter> */}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
