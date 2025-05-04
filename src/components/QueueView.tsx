import { FileTable } from "@/FileTable/FileTable.tsx";
import { ColumnTypes, columns } from "@/FileTable/Columns.tsx";
import { useState, useEffect } from "react";

function GetFiles(): ColumnTypes[] {
	return [
		{
			file: "file1",
			status: "Completed",
			frameCount: 250,
			renderFormat: "PNG",
		},
		{
			file: "file2",
			status: "In Progress",
			frameCount: 120,
			renderFormat: "JPEG",
		},
		{
			file: "file3",
			status: "Not Started",
			frameCount: 300,
			renderFormat: "TIFF",
		},
		{
			file: "file4",
			status: "Error",
			frameCount: 75,
			renderFormat: "GIF",
		},
		{
			file: "file5",
			status: "Completed",
			frameCount: 500,
			renderFormat: "MP4",
		},
	];
}

function QueueView() {
	const [data, setData] = useState<ColumnTypes[]>([]);

	useEffect(() => {
		const files = GetFiles();

		setData(files);
	}, []);

	return (
		<div>
			<FileTable columns={columns} data={data} />
		</div>
	);
}

export default QueueView;
