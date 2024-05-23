import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	SelectValue,
	SelectTrigger,
	SelectItem,
	SelectGroup,
	SelectContent,
	Select,
} from "@/components/ui/select";
import {
	DialogTrigger,
	DialogTitle,
	DialogDescription,
	DialogHeader,
	DialogFooter,
	DialogContent,
	Dialog,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

export default function Component() {
	return (
		<>
			<div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-12">
				<div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
					<div className="w-full md:w-auto flex items-center gap-2">
						<Input
							className="flex-1"
							placeholder="Search for vendors..."
							type="search"
						/>
						<Button>Search</Button>
					</div>
					<div className="w-full md:w-auto flex flex-wrap items-center gap-2">
						<Select>
							<SelectTrigger className="w-full md:w-auto">
								<SelectValue placeholder="Services" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="photography">Photography</SelectItem>
									<SelectItem value="videography">Videography</SelectItem>
									<SelectItem value="catering">Catering</SelectItem>
									<SelectItem value="music">Music</SelectItem>
									<SelectItem value="decor">Decor</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
						<Select>
							<SelectTrigger className="w-full md:w-auto">
								<SelectValue placeholder="Price Range" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="0-500">$0 - $500</SelectItem>
									<SelectItem value="500-1000">$500 - $1000</SelectItem>
									<SelectItem value="1000-2000">$1000 - $2000</SelectItem>
									<SelectItem value="2000-5000">$2000 - $5000</SelectItem>
									<SelectItem value="5000-10000">$5000 - $10000</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					<div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm overflow-hidden">
						<div className="p-4">
							<h3 className="text-lg font-semibold mb-2">Acme Photography</h3>
							<p className="text-gray-500 dark:text-gray-400 mb-4">
								$500 - $1000
							</p>
							<Button className="w-full" size="sm">
								Hire
							</Button>
						</div>
					</div>
					<div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm overflow-hidden">
						<div className="p-4">
							<h3 className="text-lg font-semibold mb-2">Delicious Catering</h3>
							<p className="text-gray-500 dark:text-gray-400 mb-4">
								$1000 - $2000
							</p>
							<Button className="w-full" size="sm">
								Hire
							</Button>
						</div>
					</div>
					<div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm overflow-hidden">
						<div className="p-4">
							<h3 className="text-lg font-semibold mb-2">Melody Music</h3>
							<p className="text-gray-500 dark:text-gray-400 mb-4">
								$2000 - $5000
							</p>
							<Button className="w-full" size="sm">
								Hire
							</Button>
						</div>
					</div>
					<div className="bg-white dark:bg-gray-950 rounded-lg shadow-sm overflow-hidden">
						<div className="p-4">
							<h3 className="text-lg font-semibold mb-2">Elegant Decor</h3>
							<p className="text-gray-500 dark:text-gray-400 mb-4">
								$5000 - $10000
							</p>
							<Button className="w-full" size="sm">
								Hire
							</Button>
						</div>
					</div>
				</div>
			</div>
			<Dialog defaultOpen>
				<DialogTrigger asChild>
					<Button className="w-full" size="sm">
						Hire
					</Button>
				</DialogTrigger>
				<DialogContent className="w-full max-w-md">
					<DialogHeader>
						<DialogTitle>Hire Acme Photography</DialogTitle>
						<DialogDescription>
							Select the sub-events you'd like to invite Acme Photography to,
							enter your offered price, and include a message.
						</DialogDescription>
					</DialogHeader>
					<div>
						<div className="grid gap-4">
							<div>
								<Label className="mb-2" htmlFor="sub-events">
									Sub-events
								</Label>
								<div className="grid grid-cols-2 gap-2">
									<Checkbox id="ceremony" value="ceremony" />
									<Label className="font-normal" htmlFor="ceremony">
										Ceremony
									</Label>
									<Checkbox id="reception" value="reception" />
									<Label className="font-normal" htmlFor="reception">
										Reception
									</Label>
									<Checkbox id="cocktail-hour" value="cocktail-hour" />
									<Label className="font-normal" htmlFor="cocktail-hour">
										Cocktail Hour
									</Label>
									<Checkbox id="bridal-portraits" value="bridal-portraits" />
									<Label className="font-normal" htmlFor="bridal-portraits">
										Bridal Portraits
									</Label>
								</div>
							</div>
							<div>
								<Label className="mb-2" htmlFor="offered-price">
									Offered Price
								</Label>
								<Input id="offered-price" placeholder="$1000" type="number" />
							</div>
							<div>
								<Label className="mb-2" htmlFor="message">
									Message
								</Label>
								<Textarea
									className="min-h-[100px]"
									id="message"
									placeholder="Include any additional details..."
								/>
							</div>
						</div>
					</div>
					<DialogFooter>
						<div>
							<Button variant="outline">Cancel</Button>
						</div>
						<Button>Send</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
