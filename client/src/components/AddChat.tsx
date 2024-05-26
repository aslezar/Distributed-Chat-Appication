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
import { search as searchApi, createGroup } from "../api"
import { ChannelType, MemberType, OtherUserType } from "@/types"
import { useAppDispatch, useAppSelector } from "@/hooks"
import { handleNewChannel } from "@/features/userSlice"
import { useSocketContext } from "@/context/SocketContext"
import toast from "react-hot-toast"

export default function AddChat({
    setChatSelected,
}: {
    setChatSelected: (id: string) => void
}) {
    const [open, setOpen] = useState(false)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <UserRoundPlus className="h-6 w-6" />
                <span className="sr-only">Add Chat</span>
            </DialogTrigger>
            <Tabs defaultValue="create-group">
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <TabsList>
                                <TabsTrigger value="create-group">
                                    Create Group
                                </TabsTrigger>
                                <TabsTrigger value="new-chat">
                                    New Chat
                                </TabsTrigger>
                            </TabsList>
                        </DialogTitle>
                    </DialogHeader>
                    <TabsContent value="create-group">
                        <CreateGroup
                            setChatSelected={setChatSelected}
                            closeDialog={setOpen}
                        />
                    </TabsContent>
                    <TabsContent value="new-chat">
                        <NewChat
                            setChatSelected={setChatSelected}
                            closeDialog={setOpen}
                        />
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
    setChatSelected,
    closeDialog,
}: {
    setChatSelected: (id: string) => void
    closeDialog: (open: boolean) => void
}) {
    const [search, setSearch] = useState("")
    const [creatingGroup, setCreatingGroup] = useState(false)
    const [results, setResults] = useState<OtherUserType[]>([])
    const [selectedMembers, setSelectedMembers] = useState<OtherUserType[]>([])

    const { user } = useAppSelector((state) => state.user)

    const dispatch = useAppDispatch()

    const { socket } = useSocketContext()

    useEffect(() => {
        if (!user) return
        setSelectedMembers([
            {
                _id: user.userId,
                name: user.name,
                profileImage: user.profileImage,
                phoneNo: user.phoneNo,
            },
        ])
    }, [user])

    if (!user) return <div>You are not logged in</div>

    const members: OtherUserType[] = user.channels
        .filter((channel) => !channel.isGroup)
        .map((channel) => {
            const member = channel.members.find(
                (member) => member.user._id !== user?.userId,
            )
            return member
        })
        .filter((member) => member !== undefined)
        .map((member) => member?.user) as OtherUserType[]

    const users = search === "" ? (members ? members : []) : results

    const isSelected = (id: string) =>
        selectedMembers.some((member) => member._id === id)

    const toggleSelection = (toggleUser: OtherUserType) => {
        if (toggleUser._id === user?.userId) return
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
        if (!socket) return
        const groupName = e.currentTarget.groupName.value
        if (!groupName) return
        const members = selectedMembers.map((member) => member._id)
        setCreatingGroup(true)

        socket.emit(
            "channel:create",
            { name: groupName, members },
            (data: any) => {
                console.log(data)
                if (!data.success) {
                    toast.error(data.msg)
                    return
                }
                const channel = data.data.channel as ChannelType
                const members = data.data.members as MemberType[]
                toast.success(data.msg)
                dispatch(
                    handleNewChannel({
                        _id: channel._id,
                        isGroup: channel.isGroup,
                        groupProfile: channel.groupProfile,
                        createdAt: channel.createdAt,
                        lastMessage: undefined,
                        members: members,
                    }),
                )
                setChatSelected(data.data.channel._id)
                closeDialog(false)
            },
        )
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

            <div className="grid gap-2">
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
                    {users &&
                        users.map(
                            (member) =>
                                member._id !== user.userId && (
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
                        disabled={member._id === user.userId}
                        onClick={() => toggleSelection(member)}
                    >
                        <Avatar className="w-8 h-8 border">
                            <AvatarImage
                                alt="John Doe"
                                src={member.profileImage}
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
                    </Button>
                ))}
            </div>
            <DialogFooter className="flex justify-end gap-2 mt-4">
                <DialogTrigger asChild>
                    <Button
                        variant="ghost"
                        disabled={creatingGroup}
                        type="button"
                    >
                        Cancel
                    </Button>
                </DialogTrigger>
                <Button type="submit">Create</Button>
            </DialogFooter>
        </form>
    )
}

function NewChat({
    setChatSelected,
    closeDialog,
}: {
    setChatSelected: (id: string) => void
    closeDialog: (open: boolean) => void
}) {
    const [search, setSearch] = useState("")
    const [results, setResults] = useState<OtherUserType[]>([])

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
                <div className="grid gap-2">
                    {results.map((member) => (
                        <div
                            className="flex items-center justify-between gap-2"
                            key={member._id}
                        >
                            <Avatar className="w-8 h-8 border">
                                <AvatarImage
                                    alt="John Doe"
                                    src={member.profileImage}
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
                                    onClick={() => {
                                        setChatSelected(member._id)
                                        closeDialog(false)
                                    }}
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
    setResults: (results: OtherUserType[]) => void
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
    member: OtherUserType
    isSelected: boolean
    toggleSelection: () => void
}) {
    return (
        <Button
            className="flex items-center justify-between gap-2"
            type="button"
            variant={isSelected ? "secondary" : "ghost"}
            onClick={toggleSelection}
        >
            <Avatar className="w-8 h-8 border">
                <AvatarImage alt="John Doe" src={member.profileImage} />
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
