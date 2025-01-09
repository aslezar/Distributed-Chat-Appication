import { MyChannelsType, MyContactType } from "./message";

export interface SocketContextType {
    server: string | null
    myChannels: MyChannelsType[]
    allContacts: MyContactType[]
    myContacts: MyContactType[]
    sendMessage: (channelId: string, message: string) => void
    selectedChannel: MyChannelsType | null
    createNewChat: (member: string) => Promise<String>
    createGroupChat: (groupName: string, members: string[]) => Promise<String>
}

export enum SocketsEventsEnum {
    NewMessage = "message:new",
    NewGroup = "group:new",
    NewChat = "group:chat",
    GetChannels = "channels:get",
    Event = "event",
    GetServerInfo = "server:info",
}

export interface SocketSuccessType<T> {
    data: T
    success: true
}

export interface SocketErrorType {
    success: false
    errors: string[]
}

export type SocketResponseType<T> = SocketSuccessType<T> | SocketErrorType