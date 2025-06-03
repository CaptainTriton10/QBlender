import { Badge } from './ui/badge';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from './ui/breadcrumb';
import { useState, useEffect } from 'react';
import { ChevronsRight } from 'lucide-react';
import { getUpdatedPath } from '@/lib/utils';

type FilePathViewProps = {
  filePath: string;
};

function FilePathView(props: FilePathViewProps) {
  const [path, setPath] = useState<string[] | string>();

  useEffect(() => {
    const updatedPath: string[] | string = getUpdatedPath(props.filePath);

    setPath(updatedPath);
  }, [props.filePath]);

  if (path) {
    if (path.length >= 3) {
      return (
        <Badge variant={'outline'}>
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
    } else if (path.length == 2) {
      return (
        <Badge variant={'outline'}>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>{path[0]}</BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronsRight />
              </BreadcrumbSeparator>
              <BreadcrumbItem>{path[1]}</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Badge>
      );
    } else {
      return (
        <Badge variant={'outline'}>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>{path[0]}</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Badge>
      );
    }
  }
}

export default FilePathView;

/* 

len = 4
["C:", "Documents", "Blender", "Render"]
 0     1            2          3
*/
