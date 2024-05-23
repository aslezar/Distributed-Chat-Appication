import { Response, Request } from "express"
import mongoose from "mongoose"

export interface TempUserPayload {
    userId: string
}

export interface UserPayload {
    userId: mongoose.Types.ObjectId
}

export interface EventPayload {
    eventId: mongoose.Types.ObjectId
    role: string
    permission: [string]
    isHost: boolean
}

declare global {
    namespace Express {
        export interface Request {
            user: UserPayload
            event?: EventPayload
            file: any
            pagination: {
                skip: number
                limit: number
                page: number
            }
        }
    }
}
