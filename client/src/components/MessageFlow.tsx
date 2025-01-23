import { useTheme } from "@/context/ThemeContext"
import MessageFlowImage from "../assets/message_flow.png"
import MessageFlowDarkImage from "../assets/message_flow_dark.png"

const MessageFlow = () => {
    const { theme } = useTheme()
    const isDark =
        theme === "dark" ||
        (theme === "system" &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)
    return (
        <div className="w-full aspect-video max-h-[500px]">
            <img
                src={isDark ? MessageFlowDarkImage : MessageFlowImage}
                alt="Message flow demonstration"
                className="object-contain w-full h-full"
            />
        </div>
    )
}

export default MessageFlow
