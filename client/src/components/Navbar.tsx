import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/hooks"
import { MessageCircle } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import ModeToggle from "./ModeToggle"

const NavBar = () => {
    const navigate = useNavigate()
    const { isAuthenticated } = useAppSelector((state) => state.user)

    return (
        <header className="px-4 lg:px-6 h-14 flex items-center">
            <Link className="flex items-center gap-2 text-xl font-bold" to="/">
                <MessageCircle className="h-8 w-8" />
                VibeTalk
            </Link>
            <nav className="ml-auto flex gap-4 sm:gap-2">
                <Button
                    variant="link"
                    className="text-sm font-medium hover:underline underline-offset-4 hidden md:block"
                    onClick={() => navigate("/#home")}
                >
                    Home
                </Button>
                <Button
                    variant="link"
                    className="text-sm font-medium hover:underline underline-offset-4 hidden md:block"
                    onClick={() => navigate("/#features")}
                >
                    Features
                </Button>
                <Button
                    variant="link"
                    className="text-sm font-medium hover:underline underline-offset-4 hidden md:block"
                    onClick={() => navigate("/#contact")}
                >
                    Contact
                </Button>
                {!isAuthenticated && (
                    <Button
                        variant="default"
                        className="text-sm font-medium hover:underline underline-offset-4"
                        onClick={() => navigate("/sign-up")}
                    >
                        Get Started
                    </Button>
                )}

                <ModeToggle />
            </nav>
        </header>
    )
}

export default NavBar
