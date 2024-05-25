import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useTheme, Theme } from "../context/ThemeContext"

export default function ModeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Select Theme</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={(value) => setTheme(value as Theme)}
                >
                    <DropdownMenuRadioItem
                        value={Theme.Light}
                        className="capitalize"
                    >
                        {Theme.Light}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                        value={Theme.Dark}
                        className="capitalize"
                    >
                        {Theme.Dark}
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                        value={Theme.System}
                        className="capitalize"
                    >
                        {Theme.System}
                    </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
