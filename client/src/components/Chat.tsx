import { useSocketContext } from "@/context/SocketContext"
import ChatProfileBar from "./ChatProfileBar"
import InputMessage from "./InputMessage"
import Messages from "./Messages"
import VibeTalkInfoWindow from "./VibeTalkInfoWindow"

export default function Chat() {
    const { selectedChannel } = useSocketContext()
    if (selectedChannel === null) {
        return <VibeTalkInfoWindow />
    }

    return (
        <>
            <ChatProfileBar channel={selectedChannel} />
            <Messages channel={selectedChannel} />
            <InputMessage channel={selectedChannel} />
        </>
    )
}
