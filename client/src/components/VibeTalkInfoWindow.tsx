import Features from "./Features"
import MessageFlow from "./MessageFlow"

const VibeTalkInfoWindow = () => {
    return (
        <div className="flex flex-col items-center justify-center p-8 gap-2">
            <h1 className="text-3xl font-bold text-center dark:text-white">
                VibeTalk Architecture
            </h1>
            <MessageFlow />

            <Features />
        </div>
    )
}

export default VibeTalkInfoWindow
