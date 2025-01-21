import mongoose from "mongoose"
import { User, Channel, Message } from "./models"
import connectDB from "./utils/db"
import dotenv from "dotenv"
import { Types } from "mongoose"
import bcrypt from "bcryptjs"
import { RolesEnum } from "./enums"

dotenv.config()

// Function to generate a random date within the past year
const randomDate = () => {
    const start = new Date()
    const end = new Date(start.getTime() - 365 * 24 * 60 * 60 * 1000)
    return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    )
}

const chooseRandomIndex = (arr: any[]) => Math.floor(Math.random() * arr.length)

// Connect to the database and drop the existing data
async function main() {
    try {
        await connectDB(process.env.MONGO_URL as string)
        // await mongoose.connection.db.dropDatabase()

        await User.deleteMany({})
        await Channel.deleteMany({})
        await Message.deleteMany({})

        let salt = await bcrypt.genSalt(5)
        const hashedPassword = await bcrypt.hash("hello@hello.com", salt)

        // Generate 10 dummy users
        const dummyUsers = Array.from({ length: 10 }, (_, i) => ({
            _id: new Types.ObjectId(),
            name: `User ${i + 1}`,
            email: `user${i + 1}@example.com`,
            phoneNo: `123-456-78${i.toString().padStart(2, "0")}`,
            password: hashedPassword,
            profileImage: "https://source.unsplash.com/random",
            status: "active",
            otp: undefined,
            createdAt: randomDate(),
            updatedAt: randomDate(),
        }))

        dummyUsers.push({
            _id: new Types.ObjectId("60f1b9e3b3f1f3b3b3f1f3b3"),
            name: "Hello Hi",
            email: "hello@hello.com",
            phoneNo: "1234567890",
            password: hashedPassword,
            profileImage: "https://source.unsplash.com/random",
            status: "active",
            otp: undefined,
            createdAt: randomDate(),
            updatedAt: randomDate(),
        })

        // Generate 4 dummy channels with random members
        const dummyChannels = Array.from({ length: 4 }, () => ({
            _id: new Types.ObjectId(),
            members: generateMembers(),
            isGroup: true,
            createdAt: randomDate(),
            updatedAt: randomDate(),
        }))

        // Generate 50 dummy chat messages
        const dummyChatMessages = Array.from({ length: 50 }, (_, i) => {
            //select receiverId randomly from user or group

            const randomChannel = dummyChannels[chooseRandomIndex(dummyChannels)]
            if (!randomChannel)
                return
            const randomUser = randomChannel.members[chooseRandomIndex(randomChannel.members)]
            if (!randomUser)
                return

            return {
                _id: new Types.ObjectId(),
                channelId: randomChannel._id,
                bucket: Math.floor(Math.random() * 10),
                senderId: randomUser.userId.toString(),
                message: `Message ${i + 1}`,
                createdAt: randomDate(),
                updatedAt: randomDate(),
            }
        })

        //Generate dummy random number of members with one admin and other members
        function generateMembers() {
            // a value between 2 to length of dummyUsers
            const randomNumberOfMembers = Math.floor(
                Math.random() * (dummyUsers.length - 1) + 2,
            )

            let selectedIndex = new Set<number>()

            while (selectedIndex.size < randomNumberOfMembers) {
                selectedIndex.add(chooseRandomIndex(dummyUsers))
            }

            const members = Array.from(selectedIndex).map((index, i) => ({
                userId: dummyUsers[index]._id,
                role: i === 0 ? RolesEnum.ADMIN : RolesEnum.MEMBER,
            }))

            // console.log(members)
            return members
        }

        // Insert the dummy data
        const users = await User.insertMany(dummyUsers)
        await Message.insertMany(dummyChatMessages)
        await Channel.insertMany(dummyChannels)

        for (const user of users) {
            if (user.email === "hello@hello.com") {
                console.log(user.generateSocketToken());
            }
        }

        console.log("Dummy data has been successfully created!")
        mongoose.connection.close()
    } catch (err) {
        console.error(err)
        mongoose.connection.close()
        process.exit(1)
    }
}

main()
