import { Badge } from "./ui/badge";
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "./ui/breadcrumb";
import { useState, useEffect } from "react";
import { ChevronsRight } from "lucide-react";
import { GetUpdatedPath } from "@/lib/utils";

type FilePathViewProps = {
    filePath: string;
}

function FilePathView(props: FilePathViewProps) {
    const [path, setPath] = useState<string[] | string>();

    useEffect(() => {
        const updatedPath: string[] | string = GetUpdatedPath(props.filePath);

        setPath(updatedPath);
    }, [props.filePath])

    if (path) return (
        <Badge variant={"outline"}>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>{path[0]}</BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <ChevronsRight />
                    </BreadcrumbSeparator>
                    <BreadcrumbEllipsis />
                    <BreadcrumbSeparator>
                        <ChevronsRight />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>{path[1]}</BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <ChevronsRight />
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