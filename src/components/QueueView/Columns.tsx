"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge.tsx";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useHotkeys } from "react-hotkeys-hook";

export type RenderItem = {
	file: string;
	status: "Not Started" | "In Progress" | "Completed" | "Error";
	frameCount: number;
	exportLocation: string;
};

export const columns: ColumnDef<RenderItem>[] = [
	{
		accessorKey: "file",
		id: "select",
		header: ({ table }) => {
			useHotkeys("a", () => {
				if (!table.getIsAllPageRowsSelected()) {
					table.toggleAllPageRowsSelected();
				}
			});

			useHotkeys("alt+a", () => {
				if (table.getIsAllPageRowsSelected()) {
					table.toggleAllPageRowsSelected();
				}
			})

			return (
				<div className="flex space-x-4 items-center">
					<Checkbox
						checked={
							table.getIsAllPageRowsSelected() ||
							(table.getIsSomePageRowsSelected() &&
								"indeterminate")
						}
						onCheckedChange={(value) =>
							table.toggleAllPageRowsSelected(!!value)
						}
					/>
					<Label>File</Label>
				</div>
			);
		},
		cell: ({ row }) => {
			const file = row.original.file;

			return (
				<div className="flex space-x-4 items-center">
					<Checkbox
						id={row.id}
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
					/>
					<Label htmlFor={row.id}>{file}</Label>
				</div>
			);
		},
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const status = row.original.status;

			if (status === "Completed") {
				return <Badge variant={"default"}>{status}</Badge>;
			} else if (status === "In Progress") {
				return <Badge variant={"secondary"}>{status}</Badge>;
			} else if (status === "Not Started") {
				return <Badge variant={"outline"}>{status}</Badge>;
			} else {
				return <Badge variant={"destructive"}>{status}</Badge>;
			}
		},
	},
	{
		accessorKey: "frameCount",
		header: "Frame Count",
	},
	{
		accessorKey: "exportLocation",
		header: "Export Location",
	}

];

// {
// 	accessorKey: "renderFormat",
// 		header: "Render Format",
// 			cell: ({ row }) => {
// 				const _thisRow = row.original;

// 				return (
// 					<Select>
// 						<SelectTrigger>
// 							<SelectValue placeholder="PNG" />
// 						</SelectTrigger>
// 						<SelectContent>
// 							<SelectItem value="PNG">PNG</SelectItem>
// 							<SelectItem value="JPEG">JPEG</SelectItem>
// 							<SelectItem value="FFMPEG">FFMPEG</SelectItem>
// 							<SelectItem value="AVIJPEG">AVI</SelectItem>
// 							<SelectItem value="WEBP">WEBP</SelectItem>
// 							<SelectItem value="OPEN_EXR_MULTILAYER">
// 								EXR Multilayer
// 							</SelectItem>
// 							<SelectItem value="OPEN_EXR">EXR</SelectItem>
// 							<SelectItem value="HDR">HDR</SelectItem>
// 						</SelectContent>
// 					</Select>
// 				);
// 			},
// 	},