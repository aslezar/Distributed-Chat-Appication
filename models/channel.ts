import { Schema, model } from "mongoose"
import { IChannel } from "../types/models"

const ChannelSchema = new Schema<IChannel>(
    {
        name: {
            type: String,
            required: [true, "Please Provide Channel Name."],
        },
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        admin: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please Provide Admin Id."],
        },
        isGroup: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
)

ChannelSchema.pre("save", function (next) {
    if (this.isNew) {
        this.members.push(this.admin)
    }
    next()
})

ChannelSchema.index({ members: 1 })

const Channel = model<IChannel>("Channel", ChannelSchema)
export default Channel
