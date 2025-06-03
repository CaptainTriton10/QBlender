import Menu from "@/components/Menu.tsx";
import { columns, RenderItem } from "@/components/QueueView/Columns";
import QueueView, { QueueViewRefType } from "@/components/QueueView/QueueView";
import { ThemeProvider } from "@/components/ThemeProvider.tsx";
import { Dispatch, useEffect, useReducer, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import { AppSidebar } from "./components/AppSidebar";
import RenderStatus from "./components/RenderStatus";
import { SidebarProvider } from "./components/ui/sidebar";
import { GetFrames } from "./handlers/BlenderDataHandler";
import Render from "./handlers/RenderHandler";
import { SetStore } from "./handlers/StoreHandler";
import { RenderQueueReducer } from "./hooks/useRenderQueue";
import { GetUpdatedPath, os } from "./lib/utils";

async function HandleSelectBlenderLocation() {
	// @ts-expect-error
	const path = await window.open_file.openFile(true, [""]).then(path => {
		SetStore("blender_location", path[0]);
	})
}

function App() {
	const [data, setData] = useState<RenderItem[]>([]);
	const [filePath, setFilePath] = useState("...");

	const [renderQueue, dispatch] = useReducer(RenderQueueReducer, []);

	const queueViewRef = useRef<QueueViewRefType>(null);
	const hasRun = useRef(false);

	const getSelectedRows = queueViewRef.current?.GetSelectedRows;

	useEffect(() => {
		const updatedQueue = renderQueue.map(render => render.ToRenderItem());

		setData(updatedQueue);
	}, [renderQueue])

	async function HandleUpload() {
		const currentQueueLength = renderQueue.length;

		// @ts-ignore
		const paths = await window.open_file.openFile(true, ["blend"]).then(paths => {
			paths.forEach((path: string) => { // Loop over each uploaded file
				const pathArray = GetUpdatedPath(path);
				const fileName = pathArray[pathArray.length - 1];

				const temporaryPath = (os == "windows") ? ["C:", "tmp"] : ["tmp"];

				dispatch({
					type: "add_render",
					render: new Render(fileName, temporaryPath)
				})
			});

			let errorShown = false;
			for (let i = 0; i < paths.length; i++) { // Loop over each uploaded file
				GetFrames(hasRun, paths[i]).then(
					function (data: number) { // If successful
						dispatch({
							type: "update_render",
							index: i + currentQueueLength,
							updates: { frameCount: data }
						})
					},

					function (error: string) { // If error occurs
						console.log(error);

						if (!errorShown) toast.error("An error occured with blender, check your selected blender location.");
						errorShown = true;

						dispatch({
							type: "update_render",
							index: i + currentQueueLength,
							updates: { frameCount: -2 }
						})
					}
				)
			}
		});
	}

	async function HandleSelectExport() {
		// @ts-expect-error sybau typescript
		const selectedRenders: number[] = getSelectedRows();

		if (!selectedRenders.length) {
			toast.warning("No renders selected.");
			return;
		}

		// @ts-expect-error
		const path = await window.open_file.openFile(false).then(path => {
			const exportLocation: string[] = path[0];
			setFilePath(path[0]);

			for (let i = 0; i < selectedRenders.length; i++) {
				dispatch({
					type: "update_render",
					index: i,
					updates: { exportLocation: exportLocation }
				})
			}
		});
	}

	async function RenderAll() {
		function Callback(data: string) {
			console.log(data);
		}

		function ClosedCallback() {
			toast.info("Render completed.")
		}

		function ErrorCallback(filename: string) {
			toast.error(`Error with render: ${filename}`)
		}

		for (let i = 0; i < renderQueue.length; i++) {
			renderQueue[i].Render(hasRun, Callback, ClosedCallback, ErrorCallback);
		}
	}

	useHotkeys("ctrl+i", HandleUpload);


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
								handleImport={HandleUpload}
								handleSelectBlenderLocation={() => HandleSelectBlenderLocation()}
								handleSelectExport={() => HandleSelectExport()}
								renderAll={RenderAll}
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