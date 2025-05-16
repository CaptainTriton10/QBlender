import { Badge } from "./ui/badge";
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "./ui/breadcrumb";
import { useState, useEffect } from "react";
import { Slash } from "lucide-react";

type FilePathViewProps = {
    filePath: string;
}

function GetUpdatedPath(filePath: string) {
    const path = filePath.split("\\");

    console.log(path);

    const updatedPath: string[] = [];
    const length = path.length;

    updatedPath.push(path[0]);

    for (let i = 0; i < 2; i++) {
        updatedPath.push(path[(length - 1) - i]);
    }

    return updatedPath;
}

function FilePathView(props: FilePathViewProps) {
    const [path, setpath] = useState<string[]>();

    useEffect(() => {
        const updatedPath = GetUpdatedPath(props.filePath);

        setpath(updatedPath);
        console.log(path);
    }, [props.filePath])

    if (path) return (
        <Badge variant={"outline"}>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>{path[0]}</BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <Slash />
                    </BreadcrumbSeparator>
                    <BreadcrumbEllipsis />
                    <BreadcrumbSeparator>
                        <Slash />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>{path[1]}</BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <Slash />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>{path[2]}</BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </Badge>
    );
}

export default FilePathView;

/* 

len = 4
["C:", "Documents", "Blender", "Render"]
 0     1            2          3
*/