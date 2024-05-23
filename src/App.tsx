import EventPage from "./pages/event";
import SubEventPage from "./pages/subEvent";
import VendorPage from "./pages/vendors";
import SearchVendorPage from "./pages/searchVendor";
import Temp from "./pages/temp";

export default function Home() {
	return (
		<div>
			<EventPage />
			<SubEventPage />
			<VendorPage />
			<SearchVendorPage />
			<Temp />
		</div>
	);
}
