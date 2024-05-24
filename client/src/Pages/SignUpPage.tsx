import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import ContinueWithGoogleButton from "../components/ContinueWithGoogleButton"
// import { useEffect } from "react"
import { useAppSelector } from "../hooks"

export default function Component() {
    const { isAuthenticated, loading } = useAppSelector((state) => state.user)
    console.log(isAuthenticated, loading)

    const handleLoginButton = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }
    const handleSignUpButton = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

    return (
        <div className="w-full lg:grid lg:min-h-[800px] lg:grid-cols-2 xl:min-h-[900px]">
            <div className="hidden bg-gray-100 lg:block dark:bg-gray-800">
                <img
                    alt="Login Image"
                    className="h-full w-full object-cover"
                    height="1080"
                    src="/placeholder.svg"
                    style={{
                        aspectRatio: "1920/1080",
                        objectFit: "cover",
                    }}
                    width="1920"
                />
            </div>
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto w-[350px] space-y-6">
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold">Welcome Back</h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Enter your credentials to access your account
                        </p>
                    </div>
                    <Tabs className="space-y-4" defaultValue="login">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="login">Login</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>
                        <TabsContent value="login">
                            <form
                                className="space-y-4"
                                onSubmit={handleLoginButton}
                            >
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    required
                                    className="space-y-2"
                                />

                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    required
                                    className="space-y-2"
                                />

                                <Button className="w-full" type="submit">
                                    {loading ? "Loading..." : "Login"}
                                </Button>
                                <Link
                                    className="ml-auto inline-block text-sm underline"
                                    to="/forgot-password"
                                >
                                    Forgot Password?
                                </Link>
                            </form>
                        </TabsContent>
                        <TabsContent value="signup">
                            <form
                                className="space-y-4"
                                onSubmit={handleSignUpButton}
                            >
                                <div className="space-y-2">
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Name"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Email"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Password"
                                        required
                                    />
                                </div>
                                <Button className="w-full" type="submit">
                                    {loading ? "Loading..." : "Sign Up"}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                    <Separator />
                    <ContinueWithGoogleButton />
                </div>
            </div>
        </div>
    )
}
