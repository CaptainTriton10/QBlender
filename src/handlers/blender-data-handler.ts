import { blenderLocation } from '@/lib/utils';
import { runCommand } from './command-handler';
import { MutableRefObject } from 'react';
import { Command } from '@/types';

const GET_FRAMES_LOCATION = 'src/blender/get-frames.py';

async function getFrames(hasRun: MutableRefObject<boolean>, blendFile: string) {
  return new Promise<number>((resolve, reject) => {
    let command: Command = {
      command: blenderLocation,
      args: ['-b', blendFile, '-P', GET_FRAMES_LOCATION],
    };

    const processData = (data: string) => {
      if (!data.toLowerCase().includes('blender')) {
        const frameCount = parseInt(data);
        if (data) resolve(frameCount);
        else {
          reject(`Unable to parse frame count: ${data}`);
          console.log('Unable to parse frame count: ', data);
        }
      }
    };

    runCommand(hasRun, command, processData, () => reject('Command error.'));
  });
}

export { getFrames };
