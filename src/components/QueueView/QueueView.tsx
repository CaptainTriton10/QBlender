"use client";

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { useImperativeHandle, Ref, useState } from "react";

type QueueViewRefType = {
	SelectAll: () => void;
	DeselectAll: () => void;
	GetSelectedRows: () => number[];
}

type QueueViewProps<TData, TValue> = {
	className?: string;
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	ref: Ref<QueueViewRefType>;
}

function QueueView<TData, TValue>(
	props: QueueViewProps<TData, TValue>) {

	const [rowSelection, setRowSelection] = useState({});

	const data = props.data;
	const columns = props.columns

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: {
				pageSize: 5
			}
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		state: {
			rowSelection
		}
	});

	function SelectAll() {
		if (!table.getIsAllPageRowsSelected()) {
			table.toggleAllPageRowsSelected();
		}
	}

	function DeselectAll() {
		if (table.getIsAllPageRowsSelected()) {
			table.toggleAllPageRowsSelected();
		}
	}

	function GetSelectedRows() {
		const selection: string[] = Object.keys(table.getState().rowSelection);
		if (!selection) return [];

		let selectionIndices: number[] = [];

		selection.forEach(row => {
			selectionIndices.push(parseInt(row));
		});

		return selectionIndices;
	}

	useImperativeHandle(props.ref, () => ({
		SelectAll,
		DeselectAll,
		GetSelectedRows
	}))

	return (
		<div className={props.className}>
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => {
								return (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
												header.column.columnDef
													.header,
												header.getContext()
											)}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(
											cell.column.columnDef.cell,
											cell.getContext()
										)}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="h-24 text-center"
							>
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			<div className="flex justify-center gap-5 my-5">
				<Button
					className="bg-background"
					variant={(table.getCanPreviousPage()) ? "secondary" : "outline"}
					size="sm"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}>
					Previous
				</Button>
				<Button
					className="mb-auto"
					variant={(table.getCanNextPage()) ? "secondary" : "outline"}
					size="sm"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}>
					Next
				</Button>
			</div>
		</div >
	);
}

export default QueueView;
export type { QueueViewRefType };