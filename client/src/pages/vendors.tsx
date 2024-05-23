import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardContent, Card } from "@/components/ui/card";

export default function Component() {
	return (
		<section className="container mx-auto px-4 py-8 md:px-6 md:py-12">
			<div className="flex items-center justify-between mb-6 md:mb-8">
				<h1 className="text-2xl font-bold tracking-tight">Vendor List</h1>
				<Button size="sm">Book a Vendor</Button>
			</div>
			<div className="grid gap-6 md:gap-8">
				<div>
					<h2 className="text-lg font-semibold mb-4">My Vendors</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
						<Card>
							<CardContent className="p-4 md:p-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold">Jane Doe</h3>
									<Badge variant="secondary">Hired</Badge>
								</div>
								<div className="flex flex-wrap gap-2 mb-4">
									<Badge>Wedding</Badge>
									<Badge>Engagement</Badge>
								</div>
								<div className="flex items-center justify-between">
									<div className="text-gray-500 dark:text-gray-400">
										<span className="font-medium">$150</span>/ hour
										{"\n                                "}
									</div>
									<div className="flex items-center gap-2">
										<Button size="sm" variant="outline">
											View
										</Button>
										<Button size="sm">Hire</Button>
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4 md:p-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold">John Smith</h3>
									<Badge variant="secondary">Hired</Badge>
								</div>
								<div className="flex flex-wrap gap-2 mb-4">
									<Badge>Birthday</Badge>
									<Badge>Corporate Event</Badge>
								</div>
								<div className="flex items-center justify-between">
									<div className="text-gray-500 dark:text-gray-400">
										<span className="font-medium">$200</span>/ hour
										{"\n                                "}
									</div>
									<div className="flex items-center gap-2">
										<Button size="sm" variant="outline">
											View
										</Button>
										<Button size="sm">Hire</Button>
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4 md:p-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold">Sarah Johnson</h3>
									<Badge variant="secondary">Hired</Badge>
								</div>
								<div className="flex flex-wrap gap-2 mb-4">
									<Badge>Baby Shower</Badge>
									<Badge>Bridal Shower</Badge>
								</div>
								<div className="flex items-center justify-between">
									<div className="text-gray-500 dark:text-gray-400">
										<span className="font-medium">$175</span>/ hour
										{"\n                                "}
									</div>
									<div className="flex items-center gap-2">
										<Button size="sm" variant="outline">
											View
										</Button>
										<Button size="sm">Hire</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
				<div>
					<h2 className="text-lg font-semibold mb-4">Invited Vendors</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
						<Card>
							<CardContent className="p-4 md:p-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold">Emily Davis</h3>
									<Badge variant="info">Invited</Badge>
								</div>
								<div className="flex flex-wrap gap-2 mb-4">
									<Badge>Wedding</Badge>
									<Badge>Engagement</Badge>
								</div>
								<div className="flex items-center justify-between">
									<div className="text-gray-500 dark:text-gray-400">
										<span className="font-medium">$120</span>/ hour
										{"\n                                "}
									</div>
									<div className="flex items-center gap-2">
										<Button size="sm" variant="outline">
											View
										</Button>
										<Button size="sm">Invite</Button>
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4 md:p-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold">Michael Brown</h3>
									<Badge variant="info">Invited</Badge>
								</div>
								<div className="flex flex-wrap gap-2 mb-4">
									<Badge>Birthday</Badge>
									<Badge>Corporate Event</Badge>
								</div>
								<div className="flex items-center justify-between">
									<div className="text-gray-500 dark:text-gray-400">
										<span className="font-medium">$150</span>/ hour
										{"\n                                "}
									</div>
									<div className="flex items-center gap-2">
										<Button size="sm" variant="outline">
											View
										</Button>
										<Button size="sm">Invite</Button>
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4 md:p-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold">Olivia Wilson</h3>
									<Badge variant="info">Invited</Badge>
								</div>
								<div className="flex flex-wrap gap-2 mb-4">
									<Badge>Baby Shower</Badge>
									<Badge>Bridal Shower</Badge>
								</div>
								<div className="flex items-center justify-between">
									<div className="text-gray-500 dark:text-gray-400">
										<span className="font-medium">$130</span>/ hour
										{"\n                                "}
									</div>
									<div className="flex items-center gap-2">
										<Button size="sm" variant="outline">
											View
										</Button>
										<Button size="sm">Invite</Button>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</section>
	);
}
