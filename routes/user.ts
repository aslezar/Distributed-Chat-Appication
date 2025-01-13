import { Router } from "express"
import upload from "../utils/image-handlers/multer"
import {
    getMe,
    updateCompleteProfile,
    updateProfileImage,
    deleteProfileImage,
    // getGroup,
} from "../controllers/user"

const router = Router()

router.route("/me").get(getMe)
router.patch("/update-profile", updateCompleteProfile)
router
    .route("/image")
    .post(upload.single("image"), updateProfileImage)
    .delete(deleteProfileImage)

// router.route("/group/:groupId").get(getGroup)

export default router
