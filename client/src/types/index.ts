export interface LoginType {
    email: string
    password: string
}

export interface SignUpType {
    name: string
    email: string
}

export interface VerifyOtp {
    email: string
    otp: string
    password: string
}
export interface UserType {
    _id: string
    name: string
    email: string
    phoneNo: string
    image: string
    socketToken: string | null
    createdAt: string
}

enum RolesEnum {
    ADMIN = "admin",
    MEMBER = "member",
}

export interface MyChannelsType {
    _id: string
    name: string
    groupImage: string
    members: Array<{
        _id: string
        userId: MyContactType
        role: RolesEnum
    }>
    isGroup: boolean
    createdAt: string
}

export interface MyContactType {
    _id: string
    name: string
    email: string
    phoneNo: string
    image: string
}

export enum MessageStatusEnum {
    Delivered = "delivered",
    Read = "read",
}

export interface MessageType {
    _id: string
    channelId: string
    bucket: number
    senderId: string
    message: string
    readReceipt: Array<{
        userId: string
        status: MessageStatusEnum
        time: Date
    }>
    createdAt: string
}


export enum CallType {
    Missed = "Missed call",
    Incoming = "Incoming call",
    Outgoing = "Outgoing call",
}

export interface CallsProfileType {
    _id: string
    name: string
    type: CallType
    time: string
    profileImage: string
    isVideoCall: boolean
}
