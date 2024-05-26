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

export interface OtherUserType {
    _id: string
    name: string
    profileImage: string
    phoneNo: string
}

export interface MemberType {
    _id: String
    user: OtherUserType
    role: string
}

export interface ChannelType {
    _id: string
    isGroup: boolean
    groupProfile: {
        groupName: string
        groupImage: string
    }
    createdAt: string
}
export interface ChannelUserType extends ChannelType {
    lastMessage: MessageType | undefined
    members: MemberType[]
}
export interface UserType {
    userId: string
    name: string
    email: string
    phoneNo: string
    profileImage: string
    socketToken: string
    channels: ChannelUserType[]
    createdAt: string
}

export interface MessageType {
    _id: string
    message: string
    senderId: string
    sendToId: string
    createdAt: string
}
