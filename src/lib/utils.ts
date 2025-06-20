import { getStore } from '@/handlers/store-handler';
import { clsx, type ClassValue } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

export const os: 'windows' | 'linux' | 'macos' | 'unknown' = await window.get_os.getOS();
export const queueStore = 'queue';
export let blenderLocation: string;

blenderLocation = await getStore('blender_location');
if (!blenderLocation) blenderLocation = 'undefined';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getUpdatedPath(filepath: string) {
  let path: string[];
  let updatedPath: string[] = [];

  if (os == 'windows') path = filepath.split('\\');
  else if (os == 'linux') path = filepath.split('/');
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

function getUpdatedPathString(filepath: string | string[]) {
  const updatedPath = typeof filepath == 'string' ? getUpdatedPath(filepath) : filepath;

  if (updatedPath.length >= 3) return `${updatedPath[0]}/.../${updatedPath[1]}/${updatedPath[2]}`;
  else if (updatedPath.length === 2) return `${updatedPath[0]}/${updatedPath[1]}`;

  return updatedPath[0];
}

function getFileName(filepath: string | string[]) {
  const updatedPath = typeof filepath == 'string' ? filepath.split('\\') : filepath;
  const updatedPathLength = updatedPath.length;

  return updatedPath[updatedPathLength - 1];
}

export { cn, getUpdatedPath, getUpdatedPathString, getFileName };
