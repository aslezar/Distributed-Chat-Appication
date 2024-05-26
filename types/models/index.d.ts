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
    image: string
    myContacts: Types.Array<Schema.Types.ObjectId>
    status: string
    otp: OTP | undefined
    createdAt: Date
    updatedAt: Date
    generateToken: () => string
    generateSocketToken: () => string
    comparePassword: (password: string) => Promise<boolean>
}

export interface IMessage extends Document {
    _id: Schema.Types.ObjectId
    senderId: Schema.Types.ObjectId
    receiverId: Schema.Types.ObjectId
    modal: string
    message: string
    createdAt: Date
    updatedAt: Date
}

export interface IGroup extends Document {
    name: string
    image: string
    members: Types.Array<{
        user: Schema.Types.ObjectId
        role: string
    }>
    createdAt: Date
    updatedAt: Date
}
