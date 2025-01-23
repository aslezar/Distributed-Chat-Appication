import { Link } from "react-router-dom"

const Footer = () => {
    return (
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t mt-auto">
            <p className="text-md text-gray-500 dark:text-gray-400">
                © 2025 VibeTalk. All rights reserved.
            </p>
            <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                <Link
                    className="text-md hover:underline underline-offset-4"
                    to="https://www.linkedin.com/in/shivamgarg1234/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Linkedin
                </Link>
                <Link
                    className="text-md hover:underline underline-offset-4"
                    to="https://github.com/aslezar/Distributed-Chat-Appication"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub
                </Link>
            </nav>
        </footer>
    )
}

export default Footer
