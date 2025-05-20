import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

function GetUpdatedPath(filePath: string) {
    let path: string[];
    let updatedPath: string[] = [];

    const os = "win32"; // TODO: Update OS platform.

    if (os === "win32") {
        path = filePath.split("\\")

    } else if (os === "linux") {
        path = filePath.split("/");
    }
    else {
        toast("OS Unsupported.");
        console.log("OS Unsupported.", os);
        path = [];
    }

    const length = path.length;

    if (length <= 3) updatedPath = path;
    else {
        updatedPath.push(path[0]);
        updatedPath.push(path[length - 2]);
        updatedPath.push(path[length - 1]);
    }

    console.log(updatedPath);
    return updatedPath;
}

function GetUpdatedPathString(filePath: string) {
    const updatedPath = GetUpdatedPath(filePath);
    if (updatedPath.length >= 3) return `${updatedPath[0]}/.../${updatedPath[1]}/${updatedPath[2]}`;
    else if (updatedPath.length === 2) return `${updatedPath[0]}/${updatedPath[1]}`;

    return updatedPath[0];
}

export { cn, GetUpdatedPath, GetUpdatedPathString };