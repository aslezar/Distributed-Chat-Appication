import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { SmileIcon } from "lucide-react"
import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"
import { useTheme } from "../context/ThemeContext"

interface EmojiPickerProps {
    onChange: (value: string) => void
}
const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
    const { theme } = useTheme()

    return (
        <Popover>
            <PopoverTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                <SmileIcon className="h-6 w-6" />
                <span className="sr-only">Open Emoji Picker</span>
            </PopoverTrigger>
            <PopoverContent className="w-full">
                <Picker
                    emojiSize={18}
                    theme={theme}
                    data={data}
                    maxFrequentRows={1}
                    autoFocus={false}
                    onEmojiSelect={(emoji: any) => onChange(emoji.native)}
                />
            </PopoverContent>
        </Popover>
    )
}

export default EmojiPicker
