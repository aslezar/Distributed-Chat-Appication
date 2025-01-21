import dotenv from "dotenv"
import { RolesEnum } from "./enums"
import { Channel, User } from "./models"
import connectDB from "./utils/db"
import mongoose from "mongoose"

dotenv.config()

// Connect to the database and create a public channel for every user
async function main() {
    try {
        await connectDB(process.env.MONGO_URL as string)
        const users = await User.find({}).select("_id")
        await Channel.create({
            name: "Public Channel",
            groupImage: "https://res.cloudinary.com/blogmind/image/upload/v1737457939/vibetalk/678f80759507ff39812ed679/profile.webp",
            members: users.map((user) => ({
                userId: user._id,
                role: RolesEnum.MEMBER,
            })),
        })
    }
    catch (error) {
        console.error("Error in seeding data", error)
    }
    finally {
        await mongoose.connection.close()
    }
}

main()
