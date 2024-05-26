import { createSlice, Dispatch } from "@reduxjs/toolkit"
import { RootState } from "../store"
import toast from "react-hot-toast"
import {
    ChannelUserType,
    LoginType,
    MessageType,
    UserType,
    VerifyOtp,
} from "../types/index.ts"
import {
    signIn,
    signInGoogle,
    getMe,
    signOut,
    verifyOtp,
    getChannel,
} from "../api/index.ts"

interface CounterState {
    loading: boolean
    isAuthenticated: boolean
    user: UserType | null
}

const initialState: CounterState = {
    loading: true,
    isAuthenticated: false,
    user: null,
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        SET_USER: (state, action) => {
            // console.log(action.payload)
            state.isAuthenticated = true
            state.user = { ...state.user, ...action.payload }
            state.user?.channels.sort((a, b) => {
                const dateA = new Date(
                    a.lastMessage?.createdAt || a.createdAt,
                ).getTime()
                const dateB = new Date(
                    b.lastMessage?.createdAt || b.createdAt,
                ).getTime()
                return dateB - dateA
            })
        },
        SET_LOADING: (state) => {
            state.loading = true
        },
        //set loading false
        SET_LOADING_FALSE: (state) => {
            state.loading = false
        },
        LOGOUT_USER: (state) => {
            console.log("logout")
            state.isAuthenticated = false
            state.user = null
        },
        UPDATE_NAME: (state, action) => {
            if (state.user) state.user.name = action.payload
        },
        UPDATE_IMAGE: (state, action) => {
            if (state.user) state.user.profileImage = action.payload
        },
        NEW_CHANNEL: (state, action) => {
            //push to first
            if (state.user) state.user.channels.unshift(action.payload)
        },
        SET_NEW_MESSAGE: (state, action) => {
            const message = action.payload as MessageType
            const channelId = message.sendToId
            const channel = state.user?.channels.find(
                (channel) => channel._id === channelId,
            )
            if (channel) {
                channel.lastMessage = message
                state.user?.channels.sort((a, b) => {
                    const dateA = new Date(
                        a.lastMessage?.createdAt || a.createdAt,
                    ).getTime()
                    const dateB = new Date(
                        b.lastMessage?.createdAt || b.createdAt,
                    ).getTime()
                    return dateB - dateA
                })
                toast.success(`${message.senderId}: ${message.message}`)
            } else {
                //ask backend for the channel
                getChannel(channelId)
                    .then((res) => {
                        console.log(res.data)

                        state.user?.channels.unshift({
                            ...res.data,
                            lastMessage: message,
                        })
                    })
                    .catch((err) => console.log(err))
            }
        },
    },
})

export const logout = () => async (dispatch: Dispatch) => {
    toast.loading("Logging out", { id: "logout" })
    dispatch(userSlice.actions.SET_LOADING())
    signOut()
        .then(() => {
            dispatch(userSlice.actions.LOGOUT_USER())
            toast.success("Logged out")
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            dispatch(userSlice.actions.SET_LOADING_FALSE())
            toast.dismiss("logout")
        })
}
export const login = (loginValues: LoginType) => async (dispatch: any) => {
    if (!loginValues.email || !loginValues.password)
        return toast.error("Email and Password are required")

    dispatch(userSlice.actions.SET_LOADING())
    signIn(loginValues)
        .then(() => dispatch(loadUser()))
        .catch((err) => console.log(err))
        .finally(() => dispatch(userSlice.actions.SET_LOADING_FALSE()))
}

export const loginGoogle = (token: string) => async (dispatch: any) => {
    dispatch(userSlice.actions.SET_LOADING())
    signInGoogle(token)
        .then((_res) => dispatch(loadUser()))
        .catch((err) => console.log(err))
        .finally(() => dispatch(userSlice.actions.SET_LOADING_FALSE()))
}

export const verification =
    (verifyOtpParams: VerifyOtp) => async (dispatch: any) => {
        dispatch(userSlice.actions.SET_LOADING())
        verifyOtp(verifyOtpParams)
            .then(() => {
                dispatch(loadUser())
                localStorage.removeItem("email")
            })
            .catch((err) => console.log(err))
            .finally(() => dispatch(userSlice.actions.SET_LOADING_FALSE()))
    }

export const loadUser = () => async (dispatch: Dispatch) => {
    const isLoggedIn = document.cookie.split(";").some((cookie) => {
        const [key, _value] = cookie.split("=")
        if (key.trim() === "userId") return true
        return false
    })
    if (!isLoggedIn) return dispatch(userSlice.actions.SET_LOADING_FALSE())

    dispatch(userSlice.actions.SET_LOADING())
    getMe()
        .then((res: any) => {
            const user = res.data

            toast.success("Logged in", { id: "loadUser" })
            dispatch(userSlice.actions.SET_USER(user))
        })
        .catch((error) => console.log(error))
        .finally(() => dispatch(userSlice.actions.SET_LOADING_FALSE()))
}

export const updateName = (name: string) => async (dispatch: Dispatch) => {
    dispatch(userSlice.actions.UPDATE_NAME(name))
}

export const updateProfileImage =
    (image: string) => async (dispatch: Dispatch) => {
        dispatch(userSlice.actions.UPDATE_IMAGE(image))
    }

export const handleNewChannel =
    (group: ChannelUserType) => async (dispatch: Dispatch) => {
        console.log(group)
        dispatch(userSlice.actions.NEW_CHANNEL(group))
    }

export const handleNewMessage =
    (message: MessageType) => async (dispatch: Dispatch) => {
        dispatch(userSlice.actions.SET_NEW_MESSAGE(message))
    }

export const selectUserState = (state: RootState) => state.user

export default userSlice.reducer
