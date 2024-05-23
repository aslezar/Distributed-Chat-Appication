import { Button } from "@/components/ui/button";
import {
	DropdownMenuTrigger,
	DropdownMenuItem,
	DropdownMenuContent,
	DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function Component() {
	return (
		<>
			<section className="bg-gray-100 dark:bg-gray-900 py-8 md:py-12">
				<div className="container px-4 md:px-6">
					<div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
						<h1 className="text-2xl font-bold tracking-tight md:text-3xl">
							Wedding Celebration
						</h1>
						<div className="flex gap-2">
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
				</div>
			</section>
			<section className="container px-4 md:px-6 py-8 md:py-12">
				<div className="grid gap-6">
					<div className="grid gap-2">
						<h2 className="text-lg font-semibold">Channels</h2>
						<div className="grid gap-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<MegaphoneIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
									<span>Announcement</span>
								</div>

								<div className="flex items-center gap-2">
									<Badge className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
										3
									</Badge>
									<DropDown />
								</div>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<LockIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
									<span>Vendors Only</span>
								</div>
								<div className="flex items-center gap-2">
									<Badge className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
										3
									</Badge>
									<DropDown />
								</div>
							</div>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<UsersIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
									<span>Guests Only</span>
								</div>
								<div className="flex items-center gap-2">
									<Badge className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
										3
									</Badge>
									<DropDown />
								</div>
							</div>
						</div>
					</div>
					<div className="grid gap-2">
						<h2 className="text-lg font-semibold">Other</h2>
						<div className="grid gap-2">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<ImageIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
									<span>Photo Sharing</span>
								</div>
								<Button size="icon" variant="ghost">
									<MoveHorizontalIcon className="h-5 w-5" />
								</Button>
							</div>
						</div>
					</div>
					<Button className="justify-self-start">
						<PlusIcon className="mr-2 h-4 w-4" />
						Create Channel
					</Button>
				</div>
			</section>
		</>
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

function DropDown(props) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="icon" variant="ghost">
					<MoveHorizontalIcon className="h-5 w-5" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem>View Members List</DropdownMenuItem>
				<DropdownMenuItem>Mute Channel</DropdownMenuItem>
				<DropdownMenuItem>Delete</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function ImageIcon(props) {
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
			<rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
			<circle cx="9" cy="9" r="2" />
			<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
		</svg>
	);
}

function LockIcon(props) {
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
			<rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
			<path d="M7 11V7a5 5 0 0 1 10 0v4" />
		</svg>
	);
}

function MegaphoneIcon(props) {
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
			<path d="m3 11 18-5v12L3 14v-3z" />
			<path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
		</svg>
	);
}

function MoveHorizontalIcon(props) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="black"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			{...props}
		>
			<circle cx="12" cy="5" r="2" />
			<circle cx="12" cy="12" r="2" />
			<circle cx="12" cy="19" r="2" />
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
