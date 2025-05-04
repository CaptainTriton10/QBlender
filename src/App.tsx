import { ColumnTypes, columns } from "./FileTable/Columns.tsx"
import { FileTable } from "./FileTable/FileTable";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider.tsx"

async function HandleUpload() {
	const path = await window.ipcRenderer.invoke('dialog:openFile');
	console.log(path);
}

function GetFiles(): ColumnTypes[] {
	return [
		{
			name: "file1",
			status: "Completed",
			frameNumber: 250,
			exportType: "PNG"
		},
		{
			name: "file2",
			status: "In Progress",
			frameNumber: 120,
			exportType: "JPEG"
		},
		{
			name: "file3",
			status: "Not Started",
			frameNumber: 300,
			exportType: "TIFF"
		},
		{
			name: "file4",
			status: "Error",
			frameNumber: 75,
			exportType: "GIF"
		},
		{
			name: "file5",
			status: "Completed",
			frameNumber: 500,
			exportType: "MP4"
		}
	]
}

function App() {
	const [data, setData] = useState<ColumnTypes[]>([]);

	useEffect(() => {
		const files = GetFiles();

		setData(files);
	}, [])

	return (
		<ThemeProvider defaultTheme="dark">
			<div>
				<FileTable columns={columns} data={data}/>
			</div>
		</ThemeProvider>
	);
}

export default App;
