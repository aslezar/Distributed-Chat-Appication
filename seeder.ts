import mongoose from "mongoose"
import { User, Channel, ChatMessage } from "./models"
import connectDB from "./db/connect"
import dotenv from "dotenv"
import { Types } from "mongoose"
import bcrypt from "bcryptjs"
import { group } from "console"

dotenv.config()

// Function to generate a random date within the past year
const randomDate = () => {
    const start = new Date()
    const end = new Date(start.getTime() - 365 * 24 * 60 * 60 * 1000)
    return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    )
}

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
        const dummyChannels = [
            {
                _id: new Types.ObjectId(),
                members: generateMembers(),
                isGroup: true,
                groupProfile: {
                    groupName: "General",
                    groupImage: "https://source.unsplash.com/random",
                },
                createdAt: randomDate(),
                updatedAt: randomDate(),
            },
            {
                _id: new Types.ObjectId(),
                members: generateMembers(),
                isGroup: true,
                groupProfile: {
                    groupName: "Random",
                    groupImage: "https://source.unsplash.com/random",
                },
                createdAt: randomDate(),
                updatedAt: randomDate(),
            },
            {
                _id: new Types.ObjectId(),
                isGroup: true,
                groupProfile: {
                    groupName: "Tech Talk",
                    groupImage: "https://source.unsplash.com/random",
                },
                members: generateMembers(),
                createdAt: randomDate(),
                updatedAt: randomDate(),
            },
            {
                _id: new Types.ObjectId(),
                isGroup: true,
                groupProfile: {
                    groupName: "Social",
                    groupImage: "https://source.unsplash.com/random",
                },
                members: generateMembers(),
                createdAt: randomDate(),
                updatedAt: randomDate(),
            },
            {
                _id: new Types.ObjectId(),
                members: [
                    {
                        user: dummyUsers[0]._id,
                        role: "member",
                    },
                    {
                        user: dummyUsers[10]._id,
                        role: "member",
                    },
                ],
                isGroup: false,
                createdAt: randomDate(),
                updatedAt: randomDate(),
            },
        ]

        // Generate 50 dummy chat messages
        const dummyChatMessages = Array.from({ length: 50 }, (_, i) => {
            const selectRandomChannel = Math.floor(
                Math.random() * dummyChannels.length,
            )
            return {
                _id: new Types.ObjectId(),
                //choose random user from channel members
                senderId:
                    dummyChannels[selectRandomChannel].members[
                        Math.floor(
                            Math.random() *
                                dummyChannels[selectRandomChannel].members
                                    .length,
                        )
                    ].user,
                sendToId: dummyChannels[selectRandomChannel]._id,
                message: `Message ${i + 1}`,
                createdAt: randomDate(),
                updatedAt: randomDate(),
            }
        })

        //Generate dummy random number of members with one admin and other members
        function generateMembers() {
            const randomNumberOfMembers = Math.floor(
                Math.random() * dummyUsers.length,
            )
            let members = []
            //random admin
            members.push({
                user: dummyUsers[Math.floor(Math.random() * dummyUsers.length)]
                    ._id,
                role: "admin",
            })

            for (let i = 0; i < randomNumberOfMembers; i++) {
                // if member is already admin, skip
                if (
                    members.find((member) => member.role === "admin") !==
                    undefined
                ) {
                    continue
                }
                members.push({
                    user: dummyUsers[
                        Math.floor(Math.random() * dummyUsers.length)
                    ]._id,
                    role: "member",
                })
            }

            return members
        }

        // Insert the dummy data
        await User.insertMany(dummyUsers)
        await ChatMessage.insertMany(dummyChatMessages)
        await Channel.insertMany(dummyChannels)

        console.log("Dummy data has been successfully created!")
        mongoose.connection.close()
    } catch (err) {
        console.error(err)
        mongoose.connection.close()
        process.exit(1)
    }
}

main()
