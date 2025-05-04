"use client";

import { ColumnDef } from "@tanstack/react-table";

export type ColumnTypes = {
    name: string; 
    status: "Not Started" | "In Progress" | "Completed" | "Error";
    frameNumber: number;
    exportType: string;
}

export const columns: ColumnDef<ColumnTypes>[] = [
    {
        accessorKey: "name",
        header: "Name"
    }, 
    {
        accessorKey: "status",
        header: "Status"
    },
    {
        accessorKey: "frameNumber",
        header: "Frames"
    },
    {
        accessorKey: "exportType",
        header: "Export Type"
    }
];