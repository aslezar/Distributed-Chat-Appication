import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import emailjs from "@emailjs/browser"
import {
    MessageCircle,
    Paperclip,
    Settings,
    Signal,
    Users,
    Video,
} from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

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
                className="w-full py-12 md:py-24 lg:pt-32 border-y"
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
                                <Users className="h-6 w-6 text-gray-900 dark:text-gray-50" />
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
                                <MessageCircle className="h-6 w-6 text-gray-900 dark:text-gray-50" />
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
                                <Video className="h-6 w-6 text-gray-900 dark:text-gray-50" />
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
                                <Paperclip className="h-6 w-6 text-gray-900 dark:text-gray-50" />
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
                                <Signal className="h-6 w-6 text-gray-900 dark:text-gray-50" />
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
                                <Settings className="h-6 w-6 text-gray-900 dark:text-gray-50" />
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
                <div className="container grid items-center justify-center gap-6 px-4 text-center md:px-6">
                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
                            Contact Us
                        </h2>
                        <p className="mx-auto max-w-[700px] text-lg md:text-xl lg:text-2xl text-gray-500 dark:text-gray-400">
                            Have a question or feedback? Fill out the form below
                            and we'll get back to you.
                        </p>
                    </div>
                    <div className="mx-auto w-full max-w-md space-y-4">
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
                                    className="text-base md:text-lg"
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
                                    className="text-base md:text-lg"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Textarea
                                    id="message"
                                    name="message"
                                    disabled={loading}
                                    required
                                    className="min-h-[120px] text-base md:text-lg"
                                    placeholder="Enter your message"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="text-base md:text-lg py-2 md:py-3"
                            >
                                {loading ? "Sending..." : "Send"}
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    )
}
