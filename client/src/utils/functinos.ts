
function getObjectIdTimestamp(objectId?: string) {
    //return unix epoch timestamp in milliseconds
    if (!objectId) return new Date(0)
    const hexTimestamp = objectId.substring(0, 8)
    const timestamp = parseInt(hexTimestamp, 16)
    return new Date(timestamp * 1000)
}

export function compareObjectIdTimestamp(objectId1: string, objectId2: string) {
    return getObjectIdTimestamp(objectId1).getTime() - getObjectIdTimestamp(objectId2).getTime()
}
