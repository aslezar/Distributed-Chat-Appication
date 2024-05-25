import { createSlice, Dispatch } from "@reduxjs/toolkit"
import { RootState } from "../store"
import toast from "react-hot-toast"
import {
    ChannelUserType,
    LoginType,
    UserType,
    VerifyOtp,
} from "../types/index.ts"
import {
    signIn,
    signInGoogle,
    getMe,
    signOut,
    verifyOtp,
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
        ADD_CHANNEL: (state, action) => {
            if (state.user) state.user.channels.push(action.payload)
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

export const addChannel =
    (group: ChannelUserType) => async (dispatch: Dispatch) => {
        console.log(group)
        dispatch(userSlice.actions.ADD_CHANNEL(group))
    }
export const selectUserState = (state: RootState) => state.user

export default userSlice.reducer
