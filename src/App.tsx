import Menu from "@/components/Menu.tsx";
import { columns, RenderItem } from "@/components/QueueView/Columns";
import QueueView, { QueueViewRefType } from "@/components/QueueView/QueueView";
import { ThemeProvider } from "@/components/ThemeProvider.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Dispatch, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { AppSidebar } from "./components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import Render from "./handlers/RenderHandler";
import { GetUpdatedPathString } from "./lib/utils";

let renderQueue: Render[] = [];

function UpdateQueue(queue: Render[], item: Render | undefined, setState: Dispatch<React.SetStateAction<RenderItem[]>>) {
	if (item) queue.push(item);

	let renderItems: RenderItem[] = [];

	queue.forEach(render => {
		renderItems.push(render.ToRenderItem());
	})

	setState(renderItems);
}

async function HandleUpload(setState: Dispatch<React.SetStateAction<RenderItem[]>>) {
	// @ts-ignore
	const paths = await window.open_file.openFile(true).then(paths => {
		paths.forEach((path: string) => {
			UpdateQueue(renderQueue, new Render(path, [], ""), setState);
		});
	});
}

async function HandleSelectExport(setState: Dispatch<React.SetStateAction<RenderItem[]>>) {
	// @ts-ignore
	const path = await window.open_file.openFile(false).then(path => {
		//TODO: update only selected
		renderQueue[0].exportLocation = GetUpdatedPathString(path[0]);

		UpdateQueue(renderQueue, undefined, setState)
	})
}

function App() {
	const [data, setData] = useState<RenderItem[]>([]);

	const queueViewRef = useRef<QueueViewRefType>(null);

	useHotkeys("ctrl+i", () => HandleUpload(setData));

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
						{/* <SidebarTrigger /> */}
						<div className="p-5 flex flex-col gap-5">
							<Menu
								handleImport={() => HandleUpload(setData)}
								handleSelectExport={() => HandleSelectExport(setData)}
								selectAll={() => queueViewRef.current?.SelectAll()}
								deselectAll={() => queueViewRef.current?.DeselectAll()} />
							<QueueView ref={queueViewRef} columns={columns} data={data} />
						</div>
					</main>
				</div>
			</SidebarProvider>
		</ThemeProvider>
	);
}

export default App;
