import { Router } from "express"
import {
    register,
    login,
    continueWithGoogle,
    signOut,
    forgotPassword,
    verifyOtp,
} from "../controllers/auth"

const router = Router()

router.route("/sign-up").post(register)
router.route("/sign-in").post(login)
router.route("/sign-in/google").post(continueWithGoogle)
router.route("/forgot-password").post(forgotPassword)
router.route("/verify-otp").post(verifyOtp)
router.route("/sign-out").post(signOut)

export default router
