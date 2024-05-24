import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CardHeader, CardFooter } from "@/components/ui/card"
import { Camera, Trash, User } from "lucide-react"
import ModeToggle from "./MoodToggle"
import { useAppDispatch } from "../hooks"
import { logout } from "../features/userSlice"

export default function ViewProfileButton() {
    const dispatch = useAppDispatch()
    return (
        <Dialog>
            <DialogTrigger>
                <Button
                    variant="outline"
                    className="text-sm font-medium hover:underline underline-offset-4"
                >
                    <User className="h-6 w-6" />
                    <span className="sr-only">View Profile</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>My Profile</DialogTitle>
                    <DialogDescription>
                        <CardHeader className="flex flex-col items-center gap-4 p-6">
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
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    9876543210
                                </p>
                            </div>
                        </CardHeader>
                        <CardFooter className="flex justify-end p-4 gap-4">
                            <Button
                                variant="outline"
                                onClick={() => dispatch(logout())}
                            >
                                Log Out
                            </Button>
                            <Button>Save Changes</Button>
                        </CardFooter>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
