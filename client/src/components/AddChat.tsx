import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"

import { UserRoundPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { search as searchApi } from "../api"
import { MyContactsType } from "@/types"
import { useAppSelector } from "@/hooks"
import { useSocketContext } from "@/context/SocketContext"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export default function AddChat({}: {}) {
    const [open, setOpen] = useState(false)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <UserRoundPlus className="h-6 w-6" />
                <span className="sr-only">Add Chat</span>
            </DialogTrigger>
            <Tabs defaultValue="new-chat">
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <TabsList>
                                <TabsTrigger value="new-chat">
                                    New Chat
                                </TabsTrigger>
                                <TabsTrigger value="create-group">
                                    Create Group
                                </TabsTrigger>
                            </TabsList>
                        </DialogTitle>
                    </DialogHeader>
                    <TabsContent value="create-group">
                        <CreateGroup closeDialog={setOpen} />
                    </TabsContent>
                    <TabsContent value="new-chat">
                        <NewChat closeDialog={setOpen} />
                        <DialogFooter>
                            <DialogTrigger asChild>
                                <Button variant="ghost">Cancel</Button>
                            </DialogTrigger>
                        </DialogFooter>
                    </TabsContent>
                </DialogContent>
            </Tabs>
        </Dialog>
    )
}

function CreateGroup({
    closeDialog,
}: {
    closeDialog: (open: boolean) => void
}) {
    const [search, setSearch] = useState("")
    const [creatingGroup, setCreatingGroup] = useState(false)
    const [results, setResults] = useState<MyContactsType[]>([])
    const [selectedMembers, setSelectedMembers] = useState<MyContactsType[]>([])

    const { user } = useAppSelector((state) => state.user)
    const { createGroup, contacts } = useSocketContext()

    const navigate = useNavigate()

    useEffect(() => {
        setSelectedMembers([user])
    }, [user])

    const users = search === "" ? contacts : results

    const isSelected = (id: string) =>
        selectedMembers.some((member) => member._id === id)

    const toggleSelection = (toggleUser: MyContactsType) => {
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
        createGroup(groupName, members)
            .then((groupId) => {
                toast.success("Group Created")
                closeDialog(false)
                navigate(`/chat/${groupId}`)
            })
            .catch((error) => console.error(error.response))
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

function NewChat({ closeDialog }: { closeDialog: (open: boolean) => void }) {
    const [search, setSearch] = useState("")
    const [results, setResults] = useState<MyContactsType[]>([])
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const { createNewChat } = useSocketContext()

    const handleNewChat = (userId: string) => {
        setLoading(true)
        createNewChat(userId)
            .then(() => {
                closeDialog(false)
                navigate(`/chat/${userId}`)
            })
            .catch((error) => console.error(error.response))
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

function SearchUser({
    search,
    setSearch,
    setResults,
    children,
}: {
    search: string
    setSearch: (search: string) => void
    setResults: (results: MyContactsType[]) => void
    children: React.ReactNode
}) {
    const [timeoutId, setTimeoutId] = useState<ReturnType<
        typeof setTimeout
    > | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            searchApi(search, "user")
                .then((response: any) => setResults(response.data.users))
                .catch((error) => console.error(error.response))
        }

        if (search.length > 0) {
            if (timeoutId) clearTimeout(timeoutId)
            const id = setTimeout(fetchData, 500)
            setTimeoutId(id)
        }
    }, [search])
    return (
        <>
            <Input
                id="search-members"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Name | Phone Number"
                className="max-w-[60%] sm:max-w-[60%] mx-auto mb-2"
            />
            {children}
        </>
    )
}

function Member({
    member,
    isSelected,
    toggleSelection,
}: {
    member: MyContactsType
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
