import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { forgotPassword, signUp } from "../api"
import ContinueWithGoogleButton from "../components/ContinueWithGoogleButton"
import { login, verification } from "../features/userSlice"
import { useAppDispatch, useAppSelector } from "../hooks"

const enum STEPS {
    LoginSignUp = "login",
    VerifyOTP = "verify",
    ForgotPassword = "forgot",
}

export default function Component() {
    const [step, setStep] = useState(STEPS.LoginSignUp)

    const navigate = useNavigate()

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
            <div className="flex flex-col items-center justify-center py-12">
                <div className="mx-auto w-[350px] space-y-6 relative">
                    <Button
                        variant="link"
                        type="button"
                        className="absolute top-5 left-0 cursor-pointer"
                        onClick={() => {
                            if (step !== STEPS.LoginSignUp)
                                setStep(STEPS.LoginSignUp)
                            else navigate("/")
                        }}
                    >
                        <ArrowLeft />
                        <span className="sr-only">Back</span>
                    </Button>
                    {
                        {
                            [STEPS.LoginSignUp]: (
                                <LoginSignUpForm setStep={setStep} />
                            ),
                            [STEPS.ForgotPassword]: (
                                <ForgetPasswordForm setStep={setStep} />
                            ),
                            [STEPS.VerifyOTP]: (
                                <VerifyOtpForm setStep={setStep} />
                            ),
                        }[step]
                    }
                </div>
            </div>
        </div>
    )
}

function LoginSignUpForm({ setStep }: { setStep: (step: STEPS) => void }) {
    // const dispatch = useAppDispatch()

    return (
        <>
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
                    <SignInForm setStep={setStep} />
                </TabsContent>
                <TabsContent value="signup">
                    <SignUpForm setStep={setStep} />
                </TabsContent>
            </Tabs>
            <Separator />
            <ContinueWithGoogleButton />
        </>
    )
}

function SignInForm({ setStep }: { setStep: (step: STEPS) => void }) {
    const { loading } = useAppSelector((state) => state.user)
    const dispatch = useAppDispatch()
    const handleLoginForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const loginValues = {
            email: e.currentTarget.email.value,
            password: e.currentTarget.password.value,
        }
        dispatch(login(loginValues))
    }
    return (
        <form className="space-y-4" onSubmit={handleLoginForm}>
            <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                required
            />

            <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                required
            />

            <Button className="w-full" type="submit">
                {loading ? "Loading..." : "Login"}
            </Button>
            <Button
                type="button"
                variant="link"
                className="ml-auto inline-block text-sm underline"
                onClick={() => {
                    setStep(STEPS.ForgotPassword)
                }}
            >
                Forgot Password?
            </Button>
        </form>
    )
}

function SignUpForm({ setStep }: { setStep: (step: STEPS) => void }) {
    const [loading, setLoading] = useState(false)
    // const dispatch = useAppDispatch()

    const handleSignUpForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const signUpValues = {
            name: e.currentTarget.fullName.value,
            email: e.currentTarget.email.value,
        }

        setLoading(true)
        signUp(signUpValues)
            .then(() => {
                localStorage.setItem("email", signUpValues.email)
                setStep(STEPS.VerifyOTP)
            })
            .catch((err) => console.log(err))
            .finally(() => setLoading(false))
    }
    return (
        <form className="space-y-4" onSubmit={handleSignUpForm}>
            <Input
                id="name"
                name="fullName"
                type="text"
                placeholder="Name"
                required
            />
            <Input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                required
            />
            <Button className="w-full" type="submit">
                {loading ? "Registering..." : "Sign Up"}
            </Button>
        </form>
    )
}

function ForgetPasswordForm({ setStep }: { setStep: (step: STEPS) => void }) {
    const [loading, setLoading] = useState(false)
    const handleForgetPasswordForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const email = e.currentTarget.email.value

        setLoading(true)
        forgotPassword(email)
            .then(() => {
                localStorage.setItem("email", email)
                setStep(STEPS.VerifyOTP)
            })
            .catch((err) => console.log(err))
            .finally(() => setLoading(false))
    }
    return (
        <>
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Forget Password</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Enter your email to receive OTP
                </p>
            </div>
            <form className="space-y-4" onSubmit={handleForgetPasswordForm}>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                />
                <Button className="w-full" type="submit">
                    {loading ? "Sending OTP..." : "Send OTP"}
                </Button>
            </form>
        </>
    )
}

function VerifyOtpForm({ setStep }: { setStep: (step: STEPS) => void }) {
    const { loading } = useAppSelector((state) => state.user)

    const dispatch = useAppDispatch()

    const handleVerifyOtpForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const email = localStorage.getItem("email")
        if (!email) return setStep(STEPS.LoginSignUp)

        const forgetPasswordValues = {
            email: email,
            otp: e.currentTarget.otp.value,
            password: e.currentTarget.password.value,
        }

        dispatch(verification(forgetPasswordValues))
    }

    return (
        <>
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Verify OTP</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Enter OTP to reset password
                </p>
            </div>

            <form
                className="space-y-4 flex flex-col items-center"
                onSubmit={handleVerifyOtpForm}
            >
                <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Set Password"
                    required
                />
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
        </>
    )
}
