import { ThemeProvider } from "@/components/ThemeProvider.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import QueueView from "@/components/QueueView/QueueView";
import Menu from "@/components/Menu.tsx";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { columns, RenderItem } from "@/components/QueueView/Columns";
import { useRef } from "react";
import { QueueViewRefType } from "@/components/QueueView/QueueView";

function GetData(): RenderItem[] {
	return [{
		file: "idk.blend",
		status: "Not Started",
		frameCount: 123,
		exportLocation: "./renders/"
	}]
}

function App() {
	const data = GetData();
	const queueViewRef = useRef<QueueViewRefType>(null);

	return (
		<ThemeProvider defaultTheme="dark">
			<SidebarProvider defaultOpen={false}>
				<div style={{
					display: "flex",
					height: "100vh",
					width: "100vw"
				}}>
					<AppSidebar />
					<main style={{ flex: 1 }}>
						<SidebarTrigger />
						<div className="p-3">
							<Menu
								selectAll={() => queueViewRef.current?.SelectAll()}
								deselectAll={() => queueViewRef.current?.DeselectAll()} />
							<Separator className="my-5" />
							<QueueView ref={queueViewRef} columns={columns} data={data} />
						</div>
					</main>
				</div>
			</SidebarProvider>
		</ThemeProvider>
	);
}

export default App;
