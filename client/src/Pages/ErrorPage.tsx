import { Link } from "react-router-dom"

export default function Component() {
    return (
        <div className="flex h-[100dvh] w-full flex-col items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
            <div className="max-w-md space-y-6 text-center">
                <div className="space-y-2">
                    <h1 className="text-5xl font-bold tracking-tighter text-gray-900 dark:text-gray-50">
                        Oops, something went wrong!
                    </h1>
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                        We're sorry, but an unexpected error has occurred.
                        Please try again later or contact our support team for
                        assistance.
                    </p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row">
                    <Link
                        className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                        to="/#contact"
                    >
                        Contact Support
                    </Link>
                    <Link
                        className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-6 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                        to="/"
                    >
                        Go Back Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
