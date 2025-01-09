import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useSocketContext } from "@/context/SocketContext"
import { MyContactType } from "@/types"
import { useState } from "react"
import toast from "react-hot-toast"
import SearchUser from "./SearchUser"
import { useNavigate } from "react-router-dom"

export default function NewChat({
    closeDialog,
}: {
    closeDialog: (open: boolean) => void
}) {
    const [search, setSearch] = useState("")
    const [results, setResults] = useState<MyContactType[]>([])
    const [loading, setLoading] = useState(false)

    const { createNewChat, myChannels } = useSocketContext()
    const navigate = useNavigate()

    const handleNewChat = (userId: string) => {
        const isMyContact = myChannels
            .filter((c) => !c.isGroup)
            .find((m) =>
                m.members.some((member) => member.userId._id === userId),
            )
        if (isMyContact) {
            navigate(`/chat/${isMyContact._id}`)
            closeDialog(false)
            return
        }
        setLoading(true)
        createNewChat(userId)
            .then((_channelId) => {
                closeDialog(false)
            })
            .catch((error) => {
                toast.error(error)
                console.error(error)
            })
            .finally(() => setLoading(false))
    }

    return (
        <SearchUser
            search={search}
            setSearch={setSearch}
            setResults={setResults}
        >
            {results.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                    {search.length > 0
                        ? "No results found"
                        : "Search for a user"}
                </p>
            ) : (
                <div className="grid gap-2 max-h-[350px] overflow-y-auto">
                    {results.map((member) => (
                        <div
                            className="flex items-center justify-between gap-3 py-2 px-4"
                            key={member._id}
                        >
                            <Avatar>
                                <AvatarImage
                                    alt="John Doe"
                                    src={member.image}
                                />
                                <AvatarFallback>
                                    {member.name
                                        .split(" ")
                                        .map((word) =>
                                            word.substring(0, 1).toUpperCase(),
                                        )
                                        .join("")
                                        .substring(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <Label className="text-sm" htmlFor={member._id}>
                                    {member.name}
                                </Label>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    {member.phoneNo}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="secondary"
                                    onClick={() => handleNewChat(member._id)}
                                    disabled={loading}
                                >
                                    Message
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </SearchUser>
    )
}
