import Menu from "@/components/Menu.tsx";
import { columns, RenderItem } from "@/components/QueueView/Columns";
import QueueView, { QueueViewRefType } from "@/components/QueueView/QueueView";
import { ThemeProvider } from "@/components/ThemeProvider.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Dispatch, useRef, useState } from "react";
import { AppSidebar } from "./components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import Render from "./handlers/RenderHandler";
import { Button } from "./components/ui/button";

let renderQueue: Render[] = [];

function UpdateQueue(queue: Render[], item: Render, setState: Dispatch<React.SetStateAction<RenderItem[]>>) {
	queue.push(item);

	let renderItems: RenderItem[] = [];

	queue.forEach(render => {
		renderItems.push(render.ToRenderItem());
	})

	setState(renderItems);
}

function App() {
	const [data, setData] = useState<RenderItem[]>([]);

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
							<Button onClick={() => UpdateQueue(renderQueue, new Render("asdf", []), setData)}>press</Button>
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
