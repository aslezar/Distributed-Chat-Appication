import {
    Database,
    MessageCircle,
    Users,
    Zap,
    type LucideIcon,
} from "lucide-react"

const features = [
    {
        icon: Database,
        title: "Distributed Backend",
        description:
            "Distributed Real-Time chat application using RabbitMQ for message passing.",
    },
    {
        icon: Zap,
        title: "Smart Message Bucketing",
        description:
            "Optimized message storage and retrieval using time-based bucketing strategy for faster performance.",
    },
    {
        icon: Database,
        title: "Message Persistence",
        description:
            "All Messages are persisted in a MongoDB database for data durability.",
    },
    {
        icon: Users,
        title: "Group Messaging",
        description:
            "Scalable group conversations with real-time updates and message synchronization.",
    },
    {
        icon: MessageCircle,
        title: "Direct Messaging",
        description:
            "Instant peer-to-peer communication with message delivery guarantees.",
    },
]

const FeatureCard = ({
    icon: Icon,
    title,
    description,
}: {
    icon: LucideIcon
    title: string
    description: string
}) => (
    <div className="grid gap-2 p-6 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm hover:shadow-md">
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <Icon className="h-6 w-6 text-gray-900 dark:text-gray-50" />
            </div>
            <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            {description}
        </p>
    </div>
)

const Features = () => {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-4">
            {features.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
            ))}
        </div>
    )
}

export default Features
