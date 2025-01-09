import { Input } from "@/components/ui/input"
import { MyContactType } from "@/types"
import { useEffect, useState } from "react"
import { search as searchApi } from "../api"

export default function SearchUser({
    search,
    setSearch,
    setResults,
    children,
}: {
    search: string
    setSearch: (search: string) => void
    setResults: (results: MyContactType[]) => void
    children: React.ReactNode
}) {
    const [timeoutId, setTimeoutId] = useState<ReturnType<
        typeof setTimeout
    > | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            searchApi(search, "user")
                .then((response: any) => setResults(response.data.users))
                .catch((error) => console.error(error.response))
        }

        if (search.length > 0) {
            if (timeoutId) clearTimeout(timeoutId)
            const id = setTimeout(fetchData, 500)
            setTimeoutId(id)
        }
    }, [search])
    return (
        <>
            <Input
                id="search-members"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Name | Phone Number"
                className="max-w-[60%] sm:max-w-[60%] mx-auto mb-2"
            />
            {children}
        </>
    )
}
