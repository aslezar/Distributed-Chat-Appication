import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Schema, model } from "mongoose"
import { RolesEnum } from "../enums"
import { UserPayload } from "../types/express"
import { IUser } from "../types/models"
import Channel from "./channel"

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Please Provide Name."],
            minlength: 3,
            maxlength: 50,
        },
        email: {
            type: String,
            required: [true, "Please provide email."],
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Please provide valid email.",
            ],
            unique: true,
        },
        phoneNo: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
            minlength: 8,
        },
        image: {
            type: String,
            default:
                "https://res.cloudinary.com/dzvci8arz/image/upload/v1715358550/iaxzl2ivrkqklfvyasy1.jpg",
        },
        // For Authentication
        status: {
            type: String,
            enum: ["active", "inactive", "blocked"],
            default: "inactive",
        },
        otp: {
            value: String,
            expires: Date,
        },
    },
    {
        timestamps: true,
    },
)

const preSave = async function (this: any, next: (err?: Error) => void) {
    if (this.isNew) {
        //assign unique phone number having only 10 digits
        this.phoneNo = Math.floor(
            9000000000 + Math.random() * 1000000000,
        ).toString()

        await Channel.findByIdAndUpdate("678f82e875e7be0e87a72537", {
            $push: {
                members: {
                    userId: this._id,
                    role: RolesEnum.MEMBER,
                },
            },
        })
    }
    if (!this.isModified("password")) return next()

    try {
        const salt = await bcrypt.genSalt(5)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error: any) {
        return next(error)
    }
}

UserSchema.pre("save", preSave)

UserSchema.methods.generateToken = function () {
    return jwt.sign(
        {
            userId: this._id,
        } as UserPayload,
        process.env.JWT_SECRET as jwt.Secret,
        {
            expiresIn: process.env.JWT_LIFETIME,
        },
    )
}
UserSchema.methods.generateSocketToken = function () {
    return jwt.sign(
        {
            userId: this._id,
        } as UserPayload,
        process.env.JWT_SOCKET_SECRET as jwt.Secret,
        {
            expiresIn: process.env.JWT_LIFETIME,
        },
    )
}

UserSchema.methods.comparePassword = async function (
    password: IUser["password"],
) {
    const isMatch = await bcrypt.compare(password, this.password)
    return isMatch
}

const User = model<IUser>("User", UserSchema)
export default User
