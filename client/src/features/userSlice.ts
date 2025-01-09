import { createSlice, Dispatch } from "@reduxjs/toolkit"
import { RootState } from "../store"
import toast from "react-hot-toast"
import { LoginType, UserType, VerifyOtp } from "../types/index.ts"
import {
    signIn,
    signInGoogle,
    getMe,
    signOut,
    verifyOtp,
} from "../api/index.ts"

const defaultUser: UserType = {
    _id: "offLine",
    name: "Not Logged In",
    email: "sampleData@gmail.com",
    phoneNo: "9876543210",
    image: "https://source.unsplash.com/random",
    socketToken: null,
    createdAt: Date.now().toString(),
}

interface CounterState {
    loading: boolean
    isAuthenticated: boolean
    user: UserType
}
; ``
const initialState: CounterState = {
    loading: true,
    isAuthenticated: false,
    user: defaultUser,
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        SET_USER: (state, action) => {
            // console.log(action.payload)
            state.isAuthenticated = true
            state.user = { ...state.user, ...action.payload }
            state.loading = false
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
            state.user = defaultUser
            state.loading = false
        },
        UPDATE_NAME: (state, action) => {
            if (state.user) state.user.name = action.payload
        },
        UPDATE_IMAGE: (state, action) => {
            if (state.user) state.user.image = action.payload
        },
    },
})

export const logout = () => async (dispatch: Dispatch) => {
    toast.loading("Logging out", { id: "logout" })
    dispatch(userSlice.actions.SET_LOADING())
    signOut()
        .then(() => {
            dispatch(userSlice.actions.LOGOUT_USER())
            toast.success("Logged out", { id: "logout" })
        })
        .catch((err) => {
            console.log(err)
            toast.dismiss("logout")
            dispatch(userSlice.actions.SET_LOADING_FALSE())
        })
}
export const login = (loginValues: LoginType) => async (dispatch: any) => {
    if (!loginValues.email || !loginValues.password)
        return toast.error("Email and Password are required")

    dispatch(userSlice.actions.SET_LOADING())
    signIn(loginValues)
        .then(() => dispatch(loadUser()))
        .catch((err) => {
            console.log(err)
            dispatch(userSlice.actions.SET_LOADING_FALSE())
        })
}

export const loginGoogle = (token: string) => async (dispatch: any) => {
    dispatch(userSlice.actions.SET_LOADING())
    signInGoogle(token)
        .then((_res) => dispatch(loadUser()))
        .catch((err) => {
            console.log(err)
            dispatch(userSlice.actions.SET_LOADING_FALSE())
        })
}

export const verification =
    (verifyOtpParams: VerifyOtp) => async (dispatch: any) => {
        dispatch(userSlice.actions.SET_LOADING())
        verifyOtp(verifyOtpParams)
            .then(() => {
                dispatch(loadUser())
                localStorage.removeItem("email")
            })
            .catch((err) => {
                console.log(err)
                dispatch(userSlice.actions.SET_LOADING_FALSE())
            })
    }

export const loadUser = () => async (dispatch: Dispatch) => {
    const isLoggedIn = document.cookie.split(";").some((cookie) => {
        const [key, _value] = cookie.split("=")
        if (key.trim() === "userId") return true
        return false
    })
    if (!isLoggedIn) return dispatch(userSlice.actions.SET_LOADING_FALSE())

    getMe()
        .then((res: any) => {
            const user = res.data
            toast.success("Logged in", { id: "loadUser" })
            dispatch(userSlice.actions.SET_USER(user))
        })
        .catch((error) => console.log(error))
}

export const updateName = (name: string) => async (dispatch: Dispatch) => {
    dispatch(userSlice.actions.UPDATE_NAME(name))
}

export const updateProfileImage =
    (image: string) => async (dispatch: Dispatch) => {
        dispatch(userSlice.actions.UPDATE_IMAGE(image))
    }

export const selectUserState = (state: RootState) => state.user

export default userSlice.reducer
