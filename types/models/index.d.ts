import { Schema, Types, Model, Document } from "mongoose"
import { RolesEnum, MessageStatusEnum } from "../../enums"
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

export interface ReadReceipt {
    userId: Schema.Types.ObjectId
    status: MessageStatusEnum
    time: Date
}
export interface IMessage extends Document {
    _id: Schema.Types.ObjectId
    channelId: Schema.Types.ObjectId
    bucket: number
    senderId: Schema.Types.ObjectId
    message: string
    readReceipt: Types.Array<ReadReceipt>
    createdAt: Date
    updatedAt: Date
}

export interface Member {
    userId: Schema.Types.ObjectId
    role: RolesEnum
}

export interface IChannel extends Document {
    isGroup: boolean
    members: Types.Array<Member>
    createdAt: Date
    updatedAt: Date
}
