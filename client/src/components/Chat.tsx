import { useSocketContext } from "@/context/SocketContext"
import ChatProfileBar from "./ChatProfileBar"
import InputMessage from "./InputMessage"
import Messages from "./Messages"

export default function Chat() {
    const { selectedChannel } = useSocketContext()
    if (selectedChannel === null) {
        return (
            <img
                src="./random.jpg"
                alt="random"
                className="object-cover w-full h-full"
            />
        )
    }

    return (
        <>
            <ChatProfileBar channel={selectedChannel} />
            <Messages channel={selectedChannel} />
            <InputMessage channel={selectedChannel} />
        </>
    )
}
