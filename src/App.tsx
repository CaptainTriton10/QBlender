import { ThemeProvider } from "@/components/ThemeProvider.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import QueueView from "@/components/QueueView.tsx";
import Menu from "@/components/Menu.tsx";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";

function App() {
	return (
		<ThemeProvider defaultTheme="dark">
			<SidebarProvider>
				<div style={{
					display: "flex",
					height: "100vh",
					width: "100vw"
				}}>
					<AppSidebar />
					<main style={{ flex: 1 }}>
						<SidebarTrigger />
						<div className="p-3">
							<Menu />
							<Separator className="my-5" />
							<QueueView />
						</div>
					</main>
				</div>
			</SidebarProvider>
		</ThemeProvider>
	);
}

export default App;
