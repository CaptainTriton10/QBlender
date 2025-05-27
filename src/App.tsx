import Menu from "@/components/Menu.tsx";
import { columns, RenderItem } from "@/components/QueueView/Columns";
import QueueView, { QueueViewRefType } from "@/components/QueueView/QueueView";
import { ThemeProvider } from "@/components/ThemeProvider.tsx";
import { Dispatch, MutableRefObject, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { AppSidebar } from "./components/AppSidebar";
import { SidebarProvider } from "./components/ui/sidebar";
import { GetFrames } from "./handlers/BlenderDataHandler";
import Render from "./handlers/RenderHandler";
import { GetUpdatedPath, GetUpdatedPathString } from "./lib/utils";
import { toast } from "sonner";
import RenderStatus from "./components/RenderStatus";

let renderQueue: Render[] = [];

function UpdateQueue(queue: Render[], item: Render | undefined, setState: Dispatch<React.SetStateAction<RenderItem[]>>) {
	if (item) queue.push(item);

	let renderItems: RenderItem[] = [];

	queue.forEach(render => {
		renderItems.push(render.ToRenderItem());
	})

	setState(renderItems);
}

async function HandleUpload(setState: Dispatch<React.SetStateAction<RenderItem[]>>, hasRun: MutableRefObject<boolean>) {
	const currentQueueLength = renderQueue.length;

	// @ts-ignore
	const paths = await window.open_file.openFile(true, ["blend"]).then(paths => {
		paths.forEach((path: string) => {
			const pathArray = GetUpdatedPath(path);
			const fileName = pathArray[pathArray.length - 1];
			
			UpdateQueue(renderQueue, new Render(fileName, [], ""), setState);
		});

		let errorShown = false;
		for (let i = 0; i < paths.length; i++) {
			GetFrames(hasRun, paths[i]).then(
				function(data: number) {
					renderQueue[i + currentQueueLength].frameCount = data;
	
					UpdateQueue(renderQueue, undefined, setState);
				},

				function(error: string) {
					console.log(error);
					
					if (!errorShown) toast.error("An error occured with blender, check your selected blender location.");
					errorShown = true;
					
					renderQueue[i + currentQueueLength].frameCount = -2;

					UpdateQueue(renderQueue, undefined, setState);
				}
			)
		}
	});
}

async function HandleSelectExport(
	setState: Dispatch<React.SetStateAction<RenderItem[]>>,
	getSelectedRows: () => number[],
	setFilePath: Dispatch<React.SetStateAction<string>>) {

	// TODO: Ensure correct export location shows in properties

	const selectedRenders: number[] = getSelectedRows();

	if (!selectedRenders.length) {
		toast.warning("No renders selected.");
		return;
	}

	// @ts-expect-error
	const path = await window.open_file.openFile(false).then(path => {
		const exportLocation: string = GetUpdatedPathString(path[0]);
		setFilePath(path[0]);

		for (let i = 0; i < selectedRenders.length; i++) {
			renderQueue[selectedRenders[i]].exportLocation = exportLocation;
		}

		UpdateQueue(renderQueue, undefined, setState);
	});
}

function App() {
	const [data, setData] = useState<RenderItem[]>([]);
	const [filePath, setFilePath] = useState("...");

	const queueViewRef = useRef<QueueViewRefType>(null);
	const hasRun = useRef(false);

	useHotkeys("ctrl+i", () => HandleUpload(setData, hasRun));

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
						<div className="p-5 flex flex-col gap-5 h-full">
							<Menu
								filePath={filePath}
								setFilePath={setFilePath}
								handleImport={() => HandleUpload(setData, hasRun)}
								handleSelectExport={() => HandleSelectExport(setData,
									// @ts-expect-error shut up the dumbass compiler
									queueViewRef.current?.GetSelectedRows,
									setFilePath
								)}
								selectAll={() => queueViewRef.current?.SelectAll()}
								deselectAll={() => queueViewRef.current?.DeselectAll()} />
							<QueueView ref={queueViewRef} columns={columns} data={data} className="rounded-md border flex-grow" />
							<RenderStatus className="mt-auto rounded-md border h-30 bg-muted" />
						</div>
					</main>
				</div>
			</SidebarProvider>
		</ThemeProvider>
	);
}

export default App;
