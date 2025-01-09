import { Link } from "react-router-dom"
import ModeToggle from "./MoodToggle"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "@/hooks"
import { Contact } from "lucide-react"

const NavBar = () => {
    const navigate = useNavigate()
    const { isAuthenticated } = useAppSelector((state) => state.user)

    return (
        <header className="px-4 lg:px-6 h-14 flex items-center">
            <Link className="flex items-center justify-center" to="#">
                <Contact className="h-6 w-6" />
                <span className="sr-only">Chat App</span>
            </Link>
            <nav className="ml-auto flex gap-4 sm:gap-2">
                <Button
                    variant="link"
                    className="text-sm font-medium hover:underline underline-offset-4"
                    onClick={() => navigate("/#home")}
                >
                    Home
                </Button>
                <Button
                    variant="link"
                    className="text-sm font-medium hover:underline underline-offset-4"
                    onClick={() => navigate("/#features")}
                >
                    Features
                </Button>
                <Button
                    variant="link"
                    className="text-sm font-medium hover:underline underline-offset-4"
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
