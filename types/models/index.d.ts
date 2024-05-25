import { Schema, Types, Model } from "mongoose"

export interface OTP {
    value: string
    expires: Date
}

export interface IUser extends Document {
    _id: Types.ObjectId
    name: string
    email: string
    phoneNo: string
    password: string
    profileImage: string
    status: string
    otp: OTP | undefined
    createdAt: Date
    updatedAt: Date
    generateToken: () => string
    generateSocketToken: () => string
    comparePassword: (password: string) => Promise<boolean>
}

export interface IChatMessage extends Document {
    _id?: Schema.Types.ObjectId
    userId: Schema.Types.ObjectId
    channelId: Schema.Types.ObjectId
    message: string
    createdAt: Date
    updatedAt: Date
}

export interface IChannel extends Document {
    name: string
    members: Types.Array<Schema.Types.ObjectId>
    admin: Schema.Types.ObjectId
    isGroup: boolean
    createdAt: Date
    updatedAt: Date
}
