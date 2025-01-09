import { Types } from "mongoose";

const BUCKET_SIZE = 1000 * 60 * 60 * 24 * 7

export function getBucket(id?: Types.ObjectId) {

    if (id) {
        const timestamp = id.getTimestamp().getTime()
        return Math.floor(timestamp / BUCKET_SIZE)
    }

    const timestamp = Date.now()
    return Math.floor(timestamp / BUCKET_SIZE)

}
