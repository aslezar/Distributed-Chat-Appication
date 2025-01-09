import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserRoundPlus } from "lucide-react"
import { useState } from "react"
import CreateGroup from "./CreateGroup"
import NewChat from "./NewChat"

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
