import { Schema, model } from "mongoose"
import { IChannel } from "../types/models"
import Roles from "../roles"

const ChannelSchema = new Schema<IChannel>(
    {
        isGroup: {
            type: Boolean,
            default: false,
        },
        members: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                },
                role: {
                    type: String,
                    enum: Array.from(Object.values(Roles)),
                    default: Roles.MEMBER,
                },
            },
        ],
        groupProfile: {
            groupName: {
                type: String,
            },
            groupImage: {
                type: String,
                default:
                    "https://freeiconshop.com/wp-content/uploads/edd/many-people-outline.png",
            },
        },
    },
    { timestamps: true },
)

ChannelSchema.index({ members: 1 })

const Channel = model<IChannel>("Channel", ChannelSchema)
export default Channel
