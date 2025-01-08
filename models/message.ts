import { Schema, model } from "mongoose"
import { MessageStatusEnum } from "../enums"
import { IMessage } from "../types/models"
const messageSchema = new Schema<IMessage>(
    {
        channelId: {
            type: Schema.Types.ObjectId,
            ref: "Channel",
            required: [true, "Please Provide Channel Id."],
        },
        bucket: {
            type: Number,
            required: [true, "Please Provide Bucket."],
        },
        senderId: {
            type: Schema.Types.ObjectId,
            required: [true, "Please Provide User Id."],
            ref: "User",
        },
        message: {
            type: String,
            required: [true, "Please Provide Message."],
        },
        readReceipt: [{
            userId: Schema.Types.ObjectId,
            status: { type: String, enum: MessageStatusEnum },
            time: Date,
        }],
    },
    { timestamps: true },
)

messageSchema.index({ channelId: 1, bucket: 1, _id: 1 })

const ChatMessage = model<IMessage>("Message", messageSchema)
export default ChatMessage
