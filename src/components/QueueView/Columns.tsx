"use client";

import { Badge } from "@/components/ui/badge.tsx";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ColumnDef } from "@tanstack/react-table";
import { useHotkeys } from "react-hotkeys-hook";
import { GetUpdatedPathString } from "@/lib/utils";

export type RenderItem = {
	file: string;
	status: "Not Started" | "In Progress" | "Completed" | "Error";
	frameCount: number;
	exportLocation: string[];
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

			if (status === "Completed") return <Badge variant={"default"}>{status}</Badge>;
			else if (status === "In Progress") return <Badge variant={"secondary"}>{status}</Badge>;
			else if (status === "Not Started") return <Badge variant={"outline"}>{status}</Badge>;
			else return <Badge variant={"destructive"}>{status}</Badge>;
		},
	},
	{
		accessorKey: "frameCount",
		header: "Frame Count",
		cell: ({ row }) => {
			const frameCount = row.original.frameCount;

			if (frameCount == -1) return <Badge variant={"outline"}>Calculating...</Badge>;
			else if (frameCount == -2) return <Badge variant={"destructive"}>Error</Badge>;
			else return (<i>{frameCount}</i>);
		}
	},
	{
		accessorKey: "exportLocation",
		header: "Export Location",
		cell: ({ row }) => {
			const exportLocation = GetUpdatedPathString(row.original.exportLocation);

			if (exportLocation) return (<code>{exportLocation}</code>);
			else return (<i>No export selected.</i>);
		}
	}
];