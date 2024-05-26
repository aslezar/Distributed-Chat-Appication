import { Schema, model } from "mongoose"
import { IChatMessage } from "../types/models"
import { io } from "../socketio/index"

const chatMessageSchema = new Schema<IChatMessage>(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            required: [true, "Please Provide User Id."],
        },
        sendToId: {
            type: Schema.Types.ObjectId,
            required: [true, "Please Provide Send To."],
            ref: "Channel",
        },
        message: {
            type: String,
            required: [true, "Please Provide Message."],
        },
    },
    { timestamps: true },
)

chatMessageSchema.index({ sendToId: 1, createdAt: -1 })

const ChatMessage = model<IChatMessage>("ChatMessage", chatMessageSchema)
export default ChatMessage
