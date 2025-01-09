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