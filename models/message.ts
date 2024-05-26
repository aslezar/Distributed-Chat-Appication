import { Schema, model } from "mongoose"
import { IMessage as IMessage } from "../types/models"
import { Modal } from "../roles"
const messageSchema = new Schema<IMessage>(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            required: [true, "Please Provide User Id."],
            ref: "User",
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            required: [true, "Please Provide Send To."],
            refPath: "modal",
        },
        modal: {
            type: String,
            required: [true, "Please Provide Modal."],
            enum: Array.from(Object.values(Modal)),
        },
        message: {
            type: String,
            required: [true, "Please Provide Message."],
        },
    },
    { timestamps: true },
)

messageSchema.index({ sendToId: 1, createdAt: -1 })

const ChatMessage = model<IMessage>("ChatMessage", messageSchema)
export default ChatMessage
