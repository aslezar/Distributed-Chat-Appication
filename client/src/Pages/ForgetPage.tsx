import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import ContinueWithGoogleButton from "../components/ContinueWithGoogleButton"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

// import { useEffect } from "react"
import { useAppSelector } from "../hooks"
import { useState } from "react"

export default function Component() {
    const [step, setStep] = useState(1)
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
                        <h1 className="text-3xl font-bold">
                            {step === 1 && "Forget Password"}
                            {step === 2 && "Verify OTP"}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            {step === 1 && "Enter your email to receive OTP"}
                            {step === 2 && "Enter OTP to reset password"}
                        </p>
                    </div>
                    {step === 1 && (
                        <>
                            <form
                                className="space-y-4"
                                onSubmit={handleSignUpButton}
                            >
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    required
                                    className="space-y-2"
                                />
                                <Button className="w-full" type="submit">
                                    {loading ? "Sending OTP..." : "Send OTP"}
                                </Button>
                            </form>

                            <Separator />
                            <ContinueWithGoogleButton />
                        </>
                    )}
                    {step === 2 && (
                        <form
                            className="space-y-4 flex flex-col items-center"
                            onSubmit={handleSignUpButton}
                        >
                            <InputOTP maxLength={6} id="otp" name="otp">
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                            <Button className="w-full" type="submit">
                                {loading ? "Loading..." : "Verify OTP"}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
