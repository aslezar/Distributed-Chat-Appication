import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Component() {
	return (
		<main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
			<div className="mb-6">
				<h1 className="text-3xl font-bold">Event Name</h1>
			</div>
			<div className="mb-6 flex justify-between">
				<div className="space-x-4">
					<Button variant="outline">
						<UsersIcon className="mr-2 h-4 w-4" />
						Guest List
					</Button>
					<Button variant="outline">
						<PackageIcon className="mr-2 h-4 w-4" />
						Vendors List
					</Button>
				</div>
			</div>
			<div className="space-y-4">
				<div className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-lg font-medium">Sub-Event Name</h3>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								May 1, 2023 - May 5, 2023
							</p>
						</div>
						<Badge className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
							3
						</Badge>
					</div>
				</div>
				<div className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-lg font-medium">Another Sub-Event</h3>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								June 15, 2023 - June 20, 2023
							</p>
						</div>
						<Badge className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
							1
						</Badge>
					</div>
				</div>
				<div className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
					<div className="flex items-center justify-between">
						<div>
							<h3 className="text-lg font-medium">Upcoming Sub-Event</h3>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								July 1, 2023 - July 5, 2023
							</p>
						</div>
						<Badge className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
							2
						</Badge>
					</div>
				</div>
			</div>
			<div className="mt-8 flex justify-center">
				<Button>
					<PlusIcon className="mr-2 h-4 w-4" />
					Create Sub-Event
				</Button>
			</div>
		</main>
	);
}

function PackageIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="m7.5 4.27 9 5.15" />
			<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
			<path d="m3.3 7 8.7 5 8.7-5" />
			<path d="M12 22V12" />
		</svg>
	);
}

function PlusIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M5 12h14" />
			<path d="M12 5v14" />
		</svg>
	);
}

function UsersIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
			<path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</svg>
	);
}
