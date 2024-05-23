import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { Textarea } from "@/components/ui/textarea"
import { SVGProps, useState } from "react"
import { JSX } from "react/jsx-runtime"
import emailjs from "@emailjs/browser"
import toast from "react-hot-toast"

export default function Component() {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setLoading(true)
        emailjs
            .sendForm(
                import.meta.env.VITE_EMAILJS_SERVICE_ID!,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID!,
                e.currentTarget,
                {
                    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY!,
                },
            )
            .then(() => toast("Message sent successfully"))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false))
    }
    return (
        <main className="flex-1">
            <section
                className="w-full pt-12 md:pt-24 lg:pt-32 border-y"
                id="home"
            >
                <div className="px-4 md:px-6 space-y-10 xl:space-y-16">
                    <div className="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
                        <div>
                            <h1 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                                Connect with anyone, anywhere
                            </h1>
                        </div>
                        <div className="flex flex-col items-start space-y-4">
                            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                                Chat with friends, family, and colleagues in
                                real-time. Our app offers group chats, direct
                                messages, and audio/video calls.
                            </p>
                            <div className="space-x-4">
                                <Button onClick={() => navigate("/sign-up")}>
                                    Get Started
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full py-12 md:py-24 lg:py-32" id="features">
                <div className="container space-y-12 px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="space-y-2">
                            <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                                Key Features
                            </div>
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                                Communicate with ease
                            </h2>
                            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                                Our chat app offers a seamless experience for
                                all your communication needs.
                            </p>
                        </div>
                    </div>
                    <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3 animate-fade-in">
                        <div className="grid gap-1">
                            <div className="flex items-center gap-2">
                                <UsersIcon className="h-6 w-6 text-gray-900 dark:text-gray-50" />
                                <h3 className="text-lg font-bold">
                                    Group Chats
                                </h3>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Create and join group chats to collaborate with
                                your team or connect with friends.
                            </p>
                        </div>
                        <div className="grid gap-1">
                            <div className="flex items-center gap-2">
                                <MessageCircleIcon className="h-6 w-6 text-gray-900 dark:text-gray-50" />
                                <h3 className="text-lg font-bold">
                                    Direct Messages
                                </h3>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Send private messages to individual users for
                                one-on-one conversations.
                            </p>
                        </div>
                        <div className="grid gap-1">
                            <div className="flex items-center gap-2">
                                <VideoIcon className="h-6 w-6 text-gray-900 dark:text-gray-50" />
                                <h3 className="text-lg font-bold">
                                    Audio & Video Calls
                                </h3>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Conduct high-quality audio and video calls with
                                your contacts.
                            </p>
                        </div>
                        <div className="grid gap-1">
                            <div className="flex items-center gap-2">
                                <PaperclipIcon className="h-6 w-6 text-gray-900 dark:text-gray-50" />
                                <h3 className="text-lg font-bold">
                                    File Sharing
                                </h3>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Share files, documents, and media with your
                                contacts securely.
                            </p>
                        </div>
                        <div className="grid gap-1">
                            <div className="flex items-center gap-2">
                                <SignalIcon className="h-6 w-6 text-gray-900 dark:text-gray-50" />
                                <h3 className="text-lg font-bold">
                                    Notifications
                                </h3>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Stay up-to-date with real-time notifications for
                                new messages and activity.
                            </p>
                        </div>
                        <div className="grid gap-1">
                            <div className="flex items-center gap-2">
                                <SettingsIcon className="h-6 w-6 text-gray-900 dark:text-gray-50" />
                                <h3 className="text-lg font-bold">
                                    Customization
                                </h3>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Personalize your chat experience with custom
                                themes, emojis, and more.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section
                className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
                id="contact"
            >
                <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
                    <div className="space-y-3">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                            Contact Us
                        </h2>
                        <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                            Have a question or feedback? Fill out the form below
                            and we'll get back to you.
                        </p>
                    </div>
                    <div className="mx-auto w-full max-w-sm space-y-4">
                        <form
                            className="grid gap-4"
                            onSubmit={handleContactSubmit}
                        >
                            <div className="grid gap-2">
                                <Input
                                    id="name"
                                    name="name"
                                    disabled={loading}
                                    required
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Input
                                    id="email"
                                    name="email"
                                    disabled={loading}
                                    required
                                    placeholder="Enter your email"
                                    type="email"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Textarea
                                    id="message"
                                    name="message"
                                    disabled={loading}
                                    required
                                    className="min-h-[100px]"
                                    placeholder="Enter your message"
                                />
                            </div>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Sending..." : "Send"}
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    )
}

function MessageCircleIcon(
    props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
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
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
    )
}

function PaperclipIcon(
    props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
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
            <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
        </svg>
    )
}

function SettingsIcon(
    props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>,
) {
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
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    )
}

function SignalIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
            <path d="M2 20h.01" />
            <path d="M7 20v-4" />
            <path d="M12 20v-8" />
            <path d="M17 20V8" />
            <path d="M22 4v16" />
        </svg>
    )
}

function UsersIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    )
}

function VideoIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
            <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
            <rect x="2" y="6" width="14" height="12" rx="2" />
        </svg>
    )
}
