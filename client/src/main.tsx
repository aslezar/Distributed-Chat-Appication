import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"

import store from "./store"
import { Provider } from "react-redux"
import { ThemeProvider } from "./context/ThemeContext"
import { Toaster } from "react-hot-toast"

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </Provider>
        <Toaster
            position="bottom-right"
            reverseOrder={false}
            containerClassName="mb-[75px]"
        />
    </React.StrictMode>,
)
