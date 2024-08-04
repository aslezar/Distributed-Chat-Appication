import { Schema, model } from "mongoose"
import { IMessage as IMessage } from "../types/models"
import { MODAL } from "../roles"
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
            enum: Array.from(Object.values(MODAL)),
        },
        message: {
            type: String,
            required: [true, "Please Provide Message."],
        },
    },
    { timestamps: true },
)

messageSchema.index({ receiverId: 1, createdAt: -1 })

const ChatMessage = model<IMessage>("Message", messageSchema)
export default ChatMessage
