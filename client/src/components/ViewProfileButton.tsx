import { deleteProfileImage, updateImage, updateProfile } from "@/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Camera, Trash } from "lucide-react"
import { useRef, useState } from "react"
import toast from "react-hot-toast"
import { logout, updateName, updateProfileImage } from "../features/userSlice"
import { useAppDispatch, useAppSelector } from "../hooks"
import ModeToggle from "./ModeToggle"
import { Label } from "./ui/label"

export default function ViewProfileButton({
    server,
}: {
    server: string | null
}) {
    const nameInputRef = useRef<HTMLInputElement>(null)
    const [disableButton, setDisableButton] = useState(true)

    const [loadingProfileImage, setLoadingProfileImage] =
        useState<boolean>(false)

    const dispatch = useAppDispatch()
    const { user } = useAppSelector((state) => state.user)

    const handleSaveChanges = async () => {
        if (!user) return
        const name = nameInputRef.current?.value

        if (!name) return
        updateProfile(name)
            .then((_response) => {
                toast.success("Profile Updated")
                dispatch(updateName(name))
            })
            .catch((error) => console.log(error))
    }

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files) {
            toast.loading("Uploading...", { id: "profileImage" })
            setLoadingProfileImage(true)
            updateImage(e.target.files[0])
                .then((response) => {
                    dispatch(updateProfileImage(response.data.image))
                })
                .catch((error) => console.log(error))
                .finally(() => {
                    setLoadingProfileImage(false)
                    toast.success("Profile Image Updated", {
                        id: "profileImage",
                    })
                })
        }
    }

    const handleProfileImageDelete = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        e.preventDefault()
        setLoadingProfileImage(true)
        deleteProfileImage()
            .then((response) => {
                dispatch(updateProfileImage(response.data.defaultImage))
                toast.success("Profile Image Deleted")
            })
            .catch((error) => console.log(error))
            .finally(() => setLoadingProfileImage(false))
    }

    if (!user) return <div>Null</div>
    console.log(user)

    return (
        <Dialog
            onOpenChange={(open) => {
                if (!open) setDisableButton(true)
            }}
        >
            <DialogTrigger>
                <Avatar className="h-10 w-10">
                    <AvatarImage alt={user.name} src={user.image} />
                    <AvatarFallback>
                        {user.name
                            .split(" ")
                            .map((word) => word.substring(0, 1).toUpperCase())
                            .join("")
                            .substring(0, 2)}
                    </AvatarFallback>
                </Avatar>
                <span className="sr-only">View Profile</span>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>My Profile</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 p-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage alt="Profile Photo" src={user.image} />
                        <AvatarFallback>
                            {user.name
                                .split(" ")
                                .map((word) =>
                                    word.substring(0, 1).toUpperCase(),
                                )
                                .join("")
                                .substring(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            disabled={loadingProfileImage}
                        >
                            <Label
                                htmlFor="profileImage"
                                className="flex justify-center items-center"
                            >
                                <Camera className="mr-2 h-4 w-4" />
                                Change
                            </Label>
                        </Button>
                        <Input
                            id="profileImage"
                            type="file"
                            onChange={handleProfileChange}
                            accept="image/jpeg, image/png, image/jpg, image/webp"
                            className="hidden"
                            multiple={false}
                        />
                        <Button
                            variant="outline"
                            disabled={loadingProfileImage}
                            onClick={handleProfileImageDelete}
                        >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                        </Button>

                        <ModeToggle />
                    </div>
                    <div className="space-y-1 text-center">
                        <Input
                            id="name"
                            defaultValue={user.name}
                            type="text"
                            ref={nameInputRef}
                            minLength={3}
                            maxLength={50}
                            onChange={(e) => {
                                setDisableButton(e.target.value === user.name)
                            }}
                            className="text-xl font-semibold"
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.phoneNo}
                        </p>
                        {/* {import.meta.env.DEV && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                ID: {user._id}
                            </p>
                        )} */}
                    </div>
                    {server && (
                        <div className="flex items-center space-x-2">
                            <span className="text-lg font-medium text-green-500">
                                ✔
                            </span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Connected to Server:{" "}
                                <span className="font-semibold">{server}</span>
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex justify-end p-4 gap-4">
                    <Button
                        variant="outline"
                        onClick={() => dispatch(logout())}
                    >
                        Log Out
                    </Button>
                    <Button
                        disabled={disableButton}
                        onClick={handleSaveChanges}
                    >
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
