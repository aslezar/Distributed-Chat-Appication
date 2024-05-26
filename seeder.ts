import mongoose from "mongoose"
import { User, Group, Message } from "./models"
import connectDB from "./db/connect"
import dotenv from "dotenv"
import { Types } from "mongoose"
import bcrypt from "bcryptjs"

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
        await mongoose.connection.db.dropDatabase()

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
            myContacts: [] as Types.ObjectId[],
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
            myContacts: [],
            status: "active",
            otp: undefined,
            createdAt: randomDate(),
            updatedAt: randomDate(),
        })

        // Generate 4 dummy channels with random members
        const dummyGroups = [
            {
                _id: new Types.ObjectId(),
                name: "General",
                image: "https://source.unsplash.com/random",
                members: generateMembers(),
                createdAt: randomDate(),
                updatedAt: randomDate(),
            },
            {
                _id: new Types.ObjectId(),
                name: "Random",
                image: "https://source.unsplash.com/random",
                members: generateMembers(),
                createdAt: randomDate(),
                updatedAt: randomDate(),
            },
            {
                _id: new Types.ObjectId(),
                name: "Tech Talk",
                image: "https://source.unsplash.com/random",
                members: generateMembers(),
                createdAt: randomDate(),
                updatedAt: randomDate(),
            },
            {
                _id: new Types.ObjectId(),
                name: "Social",
                image: "https://source.unsplash.com/random",
                members: generateMembers(),
                createdAt: randomDate(),
                updatedAt: randomDate(),
            },
        ]

        // Generate 50 dummy chat messages
        const dummyChatMessages = Array.from({ length: 50 }, (_, i) => {
            //select receiverId randomly from user or group

            const isUser = Math.random() > 0.5
            const receiverIndex = isUser
                ? chooseRandomIndex(dummyUsers)
                : chooseRandomIndex(dummyGroups)

            let senderIndex = chooseRandomIndex(dummyUsers)
            while (senderIndex === receiverIndex) {
                senderIndex = chooseRandomIndex(dummyUsers)
            }
            if (isUser) {
                if (
                    !dummyUsers[receiverIndex].myContacts.includes(
                        dummyUsers[senderIndex]._id,
                    )
                ) {
                    dummyUsers[receiverIndex].myContacts.push(
                        dummyUsers[senderIndex]._id,
                    )
                    dummyUsers[senderIndex].myContacts.push(
                        dummyUsers[receiverIndex]._id,
                    )
                }
            }
            return {
                _id: new Types.ObjectId(),
                //choose random user from channel members
                senderId: dummyUsers[senderIndex]._id,
                receiverId: isUser
                    ? dummyUsers[receiverIndex]._id
                    : dummyGroups[receiverIndex]._id,
                modal: isUser ? "User" : "Group",
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
                user: dummyUsers[index]._id,
                role: i === 0 ? "admin" : "member",
            }))

            console.log(members)
            return members
        }

        // Insert the dummy data
        await User.insertMany(dummyUsers)
        await Message.insertMany(dummyChatMessages)
        await Group.insertMany(dummyGroups)

        console.log("Dummy data has been successfully created!")
        mongoose.connection.close()
    } catch (err) {
        console.error(err)
        mongoose.connection.close()
        process.exit(1)
    }
}

main()
