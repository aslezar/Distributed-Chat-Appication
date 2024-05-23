import { SVGProps } from "react"
import { Link } from "react-router-dom"
import { JSX } from "react/jsx-runtime"
import ModeToggle from "./MoodToogle"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

const NavBar = () => {
    const navigate = useNavigate()
    return (
        <header className="px-4 lg:px-6 h-14 flex items-center">
            <Link className="flex items-center justify-center" to="#">
                <ContactIcon className="h-6 w-6" />
                <span className="sr-only">Chat App</span>
            </Link>
            <nav className="ml-auto flex gap-4 sm:gap-2">
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
                <Button
                    variant="default"
                    className="text-sm font-medium hover:underline underline-offset-4"
                    onClick={() => navigate("/sign-up")}
                >
                    Get Started
                </Button>
                <ModeToggle />
            </nav>
        </header>
    )
}

function ContactIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M17 18a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2" />
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <circle cx="12" cy="10" r="2" />
            <line x1="8" x2="8" y1="2" y2="4" />
            <line x1="16" x2="16" y1="2" y2="4" />
        </svg>
    )
}

export default NavBar
