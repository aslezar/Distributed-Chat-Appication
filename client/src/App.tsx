import { useEffect } from "react"
import {
    Outlet,
    RouterProvider,
    ScrollRestoration,
    createBrowserRouter,
} from "react-router-dom"
import { useAppDispatch, useAppSelector } from "./hooks"
import { loadUser } from "./features/userSlice"

//Components
import Navbar from "./components/Navbar"
import Loader from "./components/Loader"
import Footer from "./components/Footer"

//Pages
import HomePage from "./Pages/HomePage"
import SignUp from "./Pages/SignUpPage"
import ForgotPage from "./Pages/ForgetPage"
import ErrorPage from "./Pages/ErrorPage"
import ChatPage from "./Pages/ChatPage"

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
    // if (!isAuthenticate`d) return <Navigate to="/sign-up" />
    return <Outlet />
}

const router = createBrowserRouter([
    {
        path: "/",
        // element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <HomePage /> },
            { path: "sign-up", element: <SignUp /> },
            { path: "forgot-password", element: <ForgotPage /> },
            {
                path: "chat",
                element: <ChatPage />,
                // element: <ProtectedRoute />,
                // children: [{ index: true, element: <ChatPage /> }],
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
