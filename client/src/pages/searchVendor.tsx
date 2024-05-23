import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	SelectValue,
	SelectTrigger,
	SelectItem,
	SelectContent,
	Select,
} from "@/components/ui/select";

export default function Component() {
	return (
		<div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
			<div className="mb-8 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
				<div className="flex w-full max-w-md items-center space-x-2">
					<Input
						className="flex-1"
						placeholder="Search vendors"
						type="search"
					/>
					<Button variant="outline">Search</Button>
				</div>
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<Label className="text-sm font-medium" htmlFor="services">
							Services
						</Label>
						<Select className="w-40" id="services">
							<SelectTrigger>
								<SelectValue placeholder="All Services" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="web-design">Web Design</SelectItem>
								<SelectItem value="web-development">Web Development</SelectItem>
								<SelectItem value="graphic-design">Graphic Design</SelectItem>
								<SelectItem value="digital-marketing">
									Digital Marketing
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-center gap-2">
						<Label className="text-sm font-medium" htmlFor="price-range">
							Price
						</Label>
						<Select className="w-40" id="price-range">
							<SelectTrigger>
								<SelectValue placeholder="Any Price" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="0-100">$0 - $100</SelectItem>
								<SelectItem value="101-500">$101 - $500</SelectItem>
								<SelectItem value="501-1000">$501 - $1000</SelectItem>
								<SelectItem value="1001-5000">$1001 - $5000</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				<div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
					<div className="mb-4 flex items-center justify-between">
						<h3 className="text-lg font-semibold">John Doe</h3>
						<div className="text-lg font-semibold">$50/hr</div>
					</div>
					<p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
						Experienced web designer and developer. Specializes in responsive
						design and modern web technologies.
					</p>
					<Button className="w-full">Hire</Button>
				</div>
				<div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
					<div className="mb-4 flex items-center justify-between">
						<h3 className="text-lg font-semibold">Jane Smith</h3>
						<div className="text-lg font-semibold">$75/hr</div>
					</div>
					<p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
						Skilled graphic designer with expertise in branding, print, and
						digital design.
					</p>
					<Button className="w-full">Hire</Button>
				</div>
				<div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
					<div className="mb-4 flex items-center justify-between">
						<h3 className="text-lg font-semibold">Michael Johnson</h3>
						<div className="text-lg font-semibold">$100/hr</div>
					</div>
					<p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
						Digital marketing expert with a proven track record in SEO, PPC, and
						social media campaigns.
					</p>
					<Button className="w-full">Hire</Button>
				</div>
				<div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
					<div className="mb-4 flex items-center justify-between">
						<h3 className="text-lg font-semibold">Emily Davis</h3>
						<div className="text-lg font-semibold">$80/hr</div>
					</div>
					<p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
						Experienced front-end developer with expertise in React, Vue, and
						Angular.
					</p>
					<Button className="w-full">Hire</Button>
				</div>
				<div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
					<div className="mb-4 flex items-center justify-between">
						<h3 className="text-lg font-semibold">David Lee</h3>
						<div className="text-lg font-semibold">$90/hr</div>
					</div>
					<p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
						Skilled back-end developer with expertise in Node.js, Python, and
						Ruby on Rails.
					</p>
					<Button className="w-full">Hire</Button>
				</div>
				<div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
					<div className="mb-4 flex items-center justify-between">
						<h3 className="text-lg font-semibold">Sarah Chen</h3>
						<div className="text-lg font-semibold">$60/hr</div>
					</div>
					<p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
						Experienced UI/UX designer with a focus on creating intuitive and
						visually appealing user interfaces.
					</p>
					<Button className="w-full">Hire</Button>
				</div>
				<div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
					<div className="mb-4 flex items-center justify-between">
						<h3 className="text-lg font-semibold">Alex Nguyen</h3>
						<div className="text-lg font-semibold">$120/hr</div>
					</div>
					<p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
						Highly skilled full-stack developer with expertise in a wide range
						of technologies.
					</p>
					<Button className="w-full">Hire</Button>
				</div>
				<div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-950">
					<div className="mb-4 flex items-center justify-between">
						<h3 className="text-lg font-semibold">Jessica Patel</h3>
						<div className="text-lg font-semibold">$70/hr</div>
					</div>
					<p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
						Experienced content writer and copywriter with a focus on creating
						engaging and SEO-friendly content.
					</p>
					<Button className="w-full">Hire</Button>
				</div>
			</div>
		</div>
	);
}
