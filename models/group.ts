import { Schema, model } from "mongoose"
import { IGroup } from "../types/models"
import { ROLES } from "../roles"

const GroupSchema = new Schema<IGroup>(
    {
        name: {
            type: String,
            required: [true, "Please Provide Channel Name"],
        },
        image: {
            type: String,
            default:
                "https://freeiconshop.com/wp-content/uploads/edd/many-people-outline.png",
        },
        members: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                    required: [true, "Please provide user id."],
                },
                role: {
                    type: String,
                    enum: Array.from(Object.values(ROLES)),
                    default: ROLES.MEMBER,
                },
            },
        ],
    },
    { timestamps: true },
)

GroupSchema.index({ members: 1 })

GroupSchema.pre("save", function (next) {
    //remove duplicate members
    this.members.filter((member, index) => {
        return this.members.some((m, i) => {
            return m.user.toString() === member.user.toString() && i !== index
        })
    })
    next()
})

const Channel = model<IGroup>("Group", GroupSchema)
export default Channel
