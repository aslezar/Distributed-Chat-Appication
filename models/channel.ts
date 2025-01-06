import { Schema, model } from "mongoose"
import { IChannel } from "../types/models"
import { RolesEnum } from "../enums/roles"

const ChannelSchema = new Schema<IChannel>(
    {
        members: [
            {
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                    required: [true, "Please provide user id."],
                },
                role: {
                    type: String,
                    enum: RolesEnum,
                    default: RolesEnum.MEMBER,
                },
            },
        ],
        isGroup: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true },
)

ChannelSchema.index({ members: 1 })
const Channel = model<IChannel>("Channel", ChannelSchema)
export default Channel
