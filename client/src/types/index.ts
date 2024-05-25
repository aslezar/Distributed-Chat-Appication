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
    userId: string
    name: string
    email: string
    phoneNo: string
    profileImage: string
    socketToken: string
    createdAt: string
    updatedAt: string
}
