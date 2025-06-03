import { getStore } from '@/handlers/store-handler';
import { clsx, type ClassValue } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

// @ts-expect-error
export const os = await window.get_os.getOS();
export let blenderLocation: string;

blenderLocation = await getStore('blender_location');
if (!blenderLocation) blenderLocation = 'undefined';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getUpdatedPath(filePath: string) {
  let path: string[];
  let updatedPath: string[] = [];

  if (os == 'windows') path = filePath.split('\\');
  else if (os == 'linux') path = filePath.split('/');
  else {
    path = ['error'];
    toast.warning('OS unsupported.');
    console.log('OS unsupported: ', os);
  }

  const length = path.length;

  if (length <= 3) updatedPath = path;
  else {
    updatedPath.push(path[0]);
    updatedPath.push(path[length - 2]);
    updatedPath.push(path[length - 1]);
  }

  return updatedPath;
}

function getUpdatedPathString(filePath: string | string[]) {
  const updatedPath = typeof filePath == 'string' ? getUpdatedPath(filePath) : filePath;

  if (updatedPath.length >= 3) return `${updatedPath[0]}/.../${updatedPath[1]}/${updatedPath[2]}`;
  else if (updatedPath.length === 2) return `${updatedPath[0]}/${updatedPath[1]}`;

  return updatedPath[0];
}

export { cn, getUpdatedPath, getUpdatedPathString };
