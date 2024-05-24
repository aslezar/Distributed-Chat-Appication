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
import Footer from "./components/Footer"

//Pages
import HomePage from "./Pages/HomePage"
import SignUp from "./Pages/SignUpPage"
import ErrorPage from "./Pages/ErrorPage"
import ChatPage from "./Pages/ChatPage"

const Layout = () => {
    const { isAuthenticated } = useAppSelector((state) => state.user)
    if (isAuthenticated) return <Outlet />
    return (
        <div className="flex flex-col min-h-[100dvh]">
            <Navbar />
            <ScrollRestoration />
            <Outlet />
            <Footer />
        </div>
    )
}

const MainRoute = () => {
    const { isAuthenticated } = useAppSelector((state) => state.user)
    return isAuthenticated ? <ChatPage /> : <HomePage />
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <MainRoute />,
            },
            { path: "sign-up", element: <SignUp /> },
        ],
    },
    {
        path: "/*",
        element: <ErrorPage />,
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
