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

export interface MyGroupsType {
    _id: string
    name: string
    image: string
    members: Array<{
        user: MyContactsType
        role: string
    }>
    createdAt: string
}

export interface MyContactsType {
    _id: string
    name: string
    phoneNo: string
    image: string
    createdAt: string
}

export interface MessageType {
    _id: string
    message: string
    senderId: string
    receiverId: string
    isGroup: boolean
    createdAt: string
}

export interface ContactType {
    _id: string
    name: string
    image: string
    isGroup: boolean
    lastMessage: MessageType | undefined
    createdAt: string
}

export interface NewMessage extends MessageType {
    sender: MyContactsType
    receiver: MyContactsType
}
