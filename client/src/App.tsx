import { useEffect } from "react"
import {
    Navigate,
    Outlet,
    RouterProvider,
    ScrollRestoration,
    createBrowserRouter,
} from "react-router-dom"
import { useAppDispatch, useAppSelector } from "./hooks"
import { loadUser } from "./features/userSlice"
import { SocketContextProvider } from "./context/SocketContext"

//Components
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import LoaderFullPage from "./components/LoaderFullPage"

//Pages
import HomePage from "./Pages/HomePage"
import SignUp from "./Pages/SignUpPage"
import ErrorPage from "./Pages/ErrorPage"
import ChatPage from "./Pages/ChatPage"

const Layout = () => {
    const { isAuthenticated } = useAppSelector((state) => state.user)
    if (isAuthenticated)
        return (
            <SocketContextProvider>
                <Outlet />
            </SocketContextProvider>
        )
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
    const { isAuthenticated, loading } = useAppSelector((state) => state.user)
    if (loading) return <LoaderFullPage />
    return isAuthenticated ? <ChatPage /> : <HomePage />
}

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAppSelector((state) => state.user)

    if (loading) return <LoaderFullPage />

    if (!isAuthenticated) return <Navigate to="/" />
    return <Outlet />
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
            {
                path: "chat/:chatId",
                element: <ProtectedRoute />,
                children: [{ index: true, element: <ChatPage /> }],
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
