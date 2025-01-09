import { MessageType, MyChannelsType } from "@/types"
import { X } from "lucide-react"
import toast from "react-hot-toast"
import { NavigateFunction } from "react-router-dom"

const ToastMessage = (
    message: MessageType,
    channel: MyChannelsType,
    navigate: NavigateFunction,
) => {
    let { name, groupImage: image } = channel

    if (!channel.isGroup) {
        const otherMember = channel.members.find(
            (member) => member.userId._id !== message.senderId,
        )
        if (!otherMember) {
            console.log("No other member found")
            return
        }
        name = otherMember.userId.name
        image = otherMember.userId.image
    }

    toast.custom(
        (t) => (
            <div
                className={`${
                    t.visible ? "animate-enter" : "animate-leave"
                } max-w-md w-full bg-white shadow-xl rounded-lg pointer-events-auto flex overflow-hidden transform transition-all duration-300 ease-in-out hover:shadow-2xl`}
            >
                <button
                    className="flex-1 p-4"
                    onClick={() => {
                        toast.remove(t.id)
                        navigate(`/chat/${channel._id}`)
                    }}
                >
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <img
                                className="h-12 w-12 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                                src={image}
                                alt={name}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                                {name}
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-2">
                                {message.message}
                            </p>
                        </div>
                        <button
                            onClick={() => toast.remove(t.id)}
                            className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-full p-1 transition-colors duration-200"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </button>
            </div>
        ),
        {
            id: channel._id,
            // duration: 5000,
            position: "top-right",
        },
    )
}
export default ToastMessage
