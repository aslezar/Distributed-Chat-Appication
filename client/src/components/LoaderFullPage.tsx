import { Skeleton } from "@/components/ui/skeleton"

export default function LoaderFullPage() {
    return (
        <div className="grid h-screen w-full sm:grid-cols-[350px_1fr] bg-white dark:bg-gray-950">
            <div className="border-r border-gray-200 dark:border-gray-800 hidden sm:block">
                <div className="flex h-[75px] items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
                    <Skeleton className="h-8 w-[250px]" />
                    <Skeleton className="h-8 w-[250px]" />
                </div>
                <div className="flex flex-col max-h-full overflow-y-auto gap-2 p-4">
                    <Skeleton className="h-10 w-[300px]" />
                    <Skeleton className="h-10 w-[300px]" />
                    <Skeleton className="h-10 w-[300px]" />
                    <Skeleton className="h-10 w-[300px]" />
                    <Skeleton className="h-10 w-[300px]" />
                </div>
            </div>
            <div className="flex-col max-h-full hidden sm:flex gap-2 p-4">
                <Skeleton className="h-10 w-[250px]" />
                <Skeleton className="h-10 w-[250px] ml-auto" />
                <Skeleton className="h-10 w-[250px]" />
                <Skeleton className="h-10 w-[250px]" />
                <Skeleton className="h-10 w-[250px] ml-auto" />
                <Skeleton className="h-10 w-[250px] ml-auto" />
                <Skeleton className="h-10 w-[250px]" />
                <Skeleton className="h-10 w-[250px] ml-auto" />
                <Skeleton className="h-10 w-[250px]" />
            </div>
        </div>
    )
}
