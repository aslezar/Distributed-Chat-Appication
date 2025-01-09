import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useSocketContext } from "@/context/SocketContext"
import { useAppSelector } from "@/hooks"
import { MyContactType } from "@/types"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import SearchUser from "./SearchUser"

export default function CreateGroup({
    closeDialog,
}: {
    closeDialog: (open: boolean) => void
}) {
    const [search, setSearch] = useState("")
    const [creatingGroup, setCreatingGroup] = useState(false)
    const [results, setResults] = useState<MyContactType[]>([])
    const [selectedMembers, setSelectedMembers] = useState<MyContactType[]>([])

    const { user } = useAppSelector((state) => state.user)
    const { createGroupChat, allContacts } = useSocketContext()

    useEffect(() => {
        setSelectedMembers([user])
    }, [user])

    const users = search === "" ? allContacts : results

    const isSelected = (id: string) =>
        selectedMembers.some((member) => member._id === id)

    const toggleSelection = (toggleUser: MyContactType) => {
        if (toggleUser._id === user._id) return
        if (isSelected(toggleUser._id)) {
            setSelectedMembers(
                selectedMembers.filter(
                    (member) => member._id !== toggleUser._id,
                ),
            )
        } else {
            setSelectedMembers([...selectedMembers, toggleUser])
        }
    }

    const handleCreateGroup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const groupName = e.currentTarget.groupName.value
        if (!groupName) return

        const members = selectedMembers.map((member) => member._id)

        setCreatingGroup(true)
        createGroupChat(groupName, members)
            .then((_channeld) => {
                toast.success("Group Created")
                closeDialog(false)
            })
            .catch((error) => console.error(error))
            .finally(() => setCreatingGroup(false))
    }

    return (
        <form className="px-4 py-2" onSubmit={handleCreateGroup}>
            <Input
                id="group-name"
                name="groupName"
                required
                placeholder="Enter Group Name"
                className="mx-auto mb-2 max-w-[80%] sm:max-w-[80%]"
            />

            <div className="grid gap-2 max-h-[350px] overflow-y-auto">
                <SearchUser
                    search={search}
                    setSearch={setSearch}
                    setResults={setResults}
                >
                    {users?.length === 0 && (
                        <p className="text-center text-gray-500 dark:text-gray-400">
                            No results found
                        </p>
                    )}
                    {users.map(
                        (member) =>
                            member._id !== user._id && (
                                <Member
                                    key={member._id}
                                    member={member}
                                    isSelected={isSelected(member._id)}
                                    toggleSelection={() =>
                                        toggleSelection(member)
                                    }
                                />
                            ),
                    )}
                </SearchUser>
            </div>
            <div className="flex gap-2 mb-2 overflow-x-auto text-center items-center">
                Members:
                {selectedMembers.map((member) => (
                    <Button
                        key={member._id}
                        variant="ghost"
                        className="p-1"
                        disabled={member._id === user._id}
                        onClick={() => toggleSelection(member)}
                    >
                        <Avatar className="w-8 h-8 border">
                            <AvatarImage alt="John Doe" src={member.image} />
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
                    </Button>
                ))}
            </div>
            <DialogFooter className="flex justify-end gap-2 mt-4">
                <DialogTrigger asChild>
                    <Button variant="ghost" type="button">
                        Cancel
                    </Button>
                </DialogTrigger>
                <Button type="submit" disabled={creatingGroup}>
                    Create
                </Button>
            </DialogFooter>
        </form>
    )
}
function Member({
    member,
    isSelected,
    toggleSelection,
}: {
    member: MyContactType
    isSelected: boolean
    toggleSelection: () => void
}) {
    return (
        <Button
            className="flex items-center justify-between gap-3 py-2 px-4"
            type="button"
            variant={isSelected ? "secondary" : "ghost"}
            onClick={toggleSelection}
        >
            <Avatar className="w-8 h-8 border">
                <AvatarImage alt="John Doe" src={member.image} />
                <AvatarFallback>
                    {member.name
                        .split(" ")
                        .map((word) => word.substring(0, 1).toUpperCase())
                        .join("")
                        .substring(0, 2)}
                </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">{member.name}</div>
            <div>{member.phoneNo}</div>
        </Button>
    )
}
