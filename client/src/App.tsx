import { useEffect } from "react"
import {
    Outlet,
    RouterProvider,
    ScrollRestoration,
    createBrowserRouter,
    Navigate,
} from "react-router-dom"
import { useAppDispatch, useAppSelector } from "./hooks"
import { loadUser } from "./features/userSlice"

//Components
import Navbar from "./components/Navbar"
import Loader from "./components/Loader"
import Footer from "./components/Footer"

//Pages
import HomePage from "./Pages/HomePage"
// import SignIn from "./Pages/SignInPage"
import SignUp from "./Pages/SignUpPage"
// import VerifyOTP from "./Pages/VerifyOTP"
// import ForgotPassword from "./Pages/ForgotPasswordPage"
// import ErrorPage from "./Pages/ErrorPage"
// import ProfilePage from "./Pages/ProfilePage"

const Layout = () => {
    return (
        <div className="flex flex-col min-h-[100dvh]">
            <Navbar />
            <ScrollRestoration />
            <Outlet />
            <Footer />
        </div>
    )
}
const ProtectedRoute = () => {
    const { loading, isAuthenticated } = useAppSelector((state) => state.user)

    if (loading) return <Loader />
    if (!isAuthenticated) return <Navigate to="/sign-in" />
    return <Outlet />
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        // errorElement: <ErrorPage />,
        children: [
            { index: true, element: <HomePage /> },
            // { path: "sign-in", element: <SignIn /> },
            { path: "sign-up", element: <SignUp /> },
            // { path: "forgot-password", element: <ForgotPassword /> },
            // { path: "verify", element: <VerifyOTP /> },
            {
                element: <ProtectedRoute />,
                // children: [{ path: "profile", element: <ProfilePage /> }],
            },
        ],
    },
])

function App() {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(loadUser())
    })
    return <RouterProvider router={router} />
}

export default App
