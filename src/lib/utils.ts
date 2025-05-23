import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

export const blenderLocation = "C:\\Program Files\\Blender Foundation\\Blender 4.4\\blender.exe";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

function GetUpdatedPath(filePath: string) {
    let path: string[];
    let updatedPath: string[] = [];

    // TODO: Update OS platform.
    path = filePath.split("\\");

    const length = path.length;

    if (length <= 3) updatedPath = path;
    else {
        updatedPath.push(path[0]);
        updatedPath.push(path[length - 2]);
        updatedPath.push(path[length - 1]);
    }

    console.log(filePath, updatedPath);
    return updatedPath;
}

function GetUpdatedPathString(filePath: string) {
    const updatedPath = GetUpdatedPath(filePath);
    if (updatedPath.length >= 3) return `${updatedPath[0]}/.../${updatedPath[1]}/${updatedPath[2]}/`;
    else if (updatedPath.length === 2) return `${updatedPath[0]}/${updatedPath[1]}`;

    return updatedPath[0];
}

export { cn, GetUpdatedPath, GetUpdatedPathString };