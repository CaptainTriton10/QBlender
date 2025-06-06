import { blenderLocation } from '@/lib/utils';
import { runCommand } from './command-handler';
import { MutableRefObject } from 'react';
import { Command } from '@/types';

const GET_FRAMES_LOCATION = 'src/blender/get-frames.py';

class RenderInfo {
  public command: string;
  public info: string[];
  public time: number;

  public constructor(command: string, info: string) {
    this.command = command;
    this.info = this._separateInfo(info);
    this.time = this._getTime();
  }

  private _separateInfo(info: string) {
    let chunks = info.split('|'); // Separate each info section
    chunks.map((chunk) => chunk.trim());

    return chunks;
  }

  private _getTime() {
    // Time:00:03.80
    const time = this.info[1].replace('Time:', '');
    let minutes = parseInt(time.slice(0, 2)) ? parseInt(time.slice(0, 2)) : -1;
    let seconds = parseInt(time.slice(3, 5)) ? parseInt(time.slice(3, 5)) : -1;
    let milliseconds = parseInt(time.slice(6, 8)) ? parseInt(time.slice(6, 8)) : -1;

    return milliseconds + seconds * 100 + minutes * 6000;
  }
}

async function getFrames(hasRun: MutableRefObject<boolean>, blendFile: string) {
  return new Promise<number>((resolve, reject) => {
    let command: Command = {
      command: blenderLocation,
      args: ['-b', blendFile, '-P', GET_FRAMES_LOCATION],
    };

    function processData(data: string) {
      if (!data.toLowerCase().includes('blender')) {
        const frameCount = parseInt(data);
        if (data) resolve(frameCount);
        else {
          reject(`Unable to parse frame count: ${data}`);
          console.log('Unable to parse frame count: ', data);
        }
      }
    }

    runCommand(hasRun, command, processData, () => reject('Command error.'));
  });
}

function processRender(line: string) {
  if (!(line.slice(0, 4) === 'Fra:')) {
    return;
  }
}

export { getFrames };

/*

Blender 4.4.0 (hash 05377985c527 built 2025-03-18 01:50:43)
Read blend: "C:\Code\Github Repos\QBlender\test.blend"
Fra:1 Mem:11.76M (Peak 11.76M) | Time:00:00.03 | Mem:0.00M, Peak:0.00M | Scene, ViewLayer | Synchronizing object | Suzanne
Fra:1 Mem:12.83M (Peak 12.83M) | Time:00:00.04 | Mem:0.00M, Peak:0.00M | Scene, ViewLayer | Initializing
Fra:1 Mem:11.36M (Peak 12.83M) | Time:00:00.04 | Mem:0.00M, Peak:0.00M | Scene, ViewLayer | Waiting for render to start
Fra:1 Mem:11.36M (Peak 12.83M) | Time:00:00.04 | Mem:0.00M, Peak:0.00M | Scene, ViewLayer | Loading render kernels (may take a few minutes the first time)
Fra:1 Mem:11.36M (Peak 12.83M) | Time:00:00.04 | Mem:0.00M, Peak:0.00M | Scene, ViewLayer | Updating Scene
Fra:1 Mem:11.36M (Peak 12.83M) | Time:00:00.04 | Mem:0.00M, Peak:0.00M | Scene, ViewLayer | Updating Shaders
Fra:1 Mem:11.44M (Peak 12.83M) | Time:00:00.04 | Mem:0.00M, Peak:0.00M | Scene, ViewLayer | Updating Procedurals
Fra:1 Mem:11.44M (Peak 12.83M) | Time:00:00.04 | Mem:0.00M, Peak:0.00M | Scene, ViewLayer | Updating Background
Fra:1 Mem:11.44M (Peak 12.83M) | Time:00:00.04 | Mem:0.00M, Peak:0.00M | Scene, ViewLayer | Updating Camera
Fra:1 Mem:11.44M (Peak 12.83M) | Time:00:00.04 | Mem:0.00M, Peak:0.00M | Scene, ViewLayer | Updating Meshes Flags
Fra:1 Mem:11.44M (Peak 12.83M) | Time:00:00.04 | Mem:0.00M, Peak:0.00M | Scene, ViewLayer | Updating Objects
Fra:1 Mem:11.44M (Peak 12.83M) | Time:00:00.04 | Mem:0.00M, Peak:0.00M | Scene, ViewLayer | Updating Objects | Copying Transformations to device
Fra:1 Mem:11.44M (Peak 12.83M) | Time:00:00.04 | Mem:0.00M, Peak:0.00M | Scene, ViewLayer | Updating Objects | Applying Static Transformations
Fra:1 Mem:11.44M (Peak 12.83M) | Time:00:00.04 | Mem:0.00M, Peak:0.00M | Scene, ViewLayer | Updating Particle Systems
Fra:1 Mem:11.44M (Peak 12.83M) | Time:00:00.04 | Mem:0.00M, Peak:0.00M | Scene, ViewLayer | Updating Particle Systems | Copying Particles to device
Fra:1 Mem:11.44M (Peak 12.83M) | Time:00:00.04 | Mem:0.00M, Peak:0.00M | Scene, ViewLayer | Updating Meshes
Fra:1 Mem:11.68M (Peak 12.83M) | Time:00:00.04 | Mem:0.00M, Peak:0.00M | Scene, ViewLayer | Updating Mesh | Computing attributes 
Fra:1 Mem:11.68M (Peak 12.83M) | Time:00:00.05 | Mem:0.00M, Peak:0.00M | Scene, ViewLayer | Updating Mesh | Copying Attributes to device
Fra:1 Mem:11.68M (Peak 12.83M) | Time:00:00.05 | Mem:0.00M, Peak:0.00M | Scene, ViewLayer | Updating Scene BVH | Building
Fra:1 Mem:11.68M (Peak 12.83M) | Time:00:00.05 | Mem:0.00M, Peak:0.00M | Scene, ViewLayer | Updating Scene BVH | Building BVH    
Fra:1 Mem:11.68M (Peak 12.83M) | Time:00:00.06 | Mem:0.48M, Peak:0.48M | Scene, ViewLayer | Updating Scene BVH | Building BVH 0% 
Fra:1 Mem:11.68M (Peak 12.83M) | Time:00:00.06 | Mem:1.01M, Peak:1.49M | Scene, ViewLayer | Updating Scene BVH | Copying BVH to device
Fra:1 Mem:11.68M (Peak 12.83M) | Time:00:00.06 | Mem:1.01M, Peak:1.49M | Scene, ViewLayer | Updating Mesh | Computing normals    
Fra:1 Mem:12.23M (Peak 12.83M) | Time:00:00.06 | Mem:1.01M, Peak:1.49M | Scene, ViewLayer | Updating Mesh | Copying Mesh to device
Fra:1 Mem:12.23M (Peak 12.83M) | Time:00:00.06 | Mem:1.55M, Peak:1.55M | Scene, ViewLayer | Updating Objects Flags
Fra:1 Mem:12.23M (Peak 12.83M) | Time:00:00.06 | Mem:1.55M, Peak:1.55M | Scene, ViewLayer | Updating Primitive Offsets
Fra:1 Mem:12.23M (Peak 12.83M) | Time:00:00.06 | Mem:1.55M, Peak:1.55M | Scene, ViewLayer | Updating Images
Fra:1 Mem:12.23M (Peak 12.83M) | Time:00:00.06 | Mem:1.55M, Peak:1.55M | Scene, ViewLayer | Updating Camera Volume
Fra:1 Mem:12.23M (Peak 12.83M) | Time:00:00.06 | Mem:1.55M, Peak:1.55M | Scene, ViewLayer | Updating Lookup Tables
Fra:1 Mem:12.23M (Peak 12.83M) | Time:00:00.06 | Mem:1.63M, Peak:1.63M | Scene, ViewLayer | Updating Lights
Fra:1 Mem:12.23M (Peak 12.83M) | Time:00:00.06 | Mem:1.63M, Peak:1.63M | Scene, ViewLayer | Updating Lights | Computing tree     
Fra:1 Mem:12.23M (Peak 12.83M) | Time:00:00.06 | Mem:1.63M, Peak:1.63M | Scene, ViewLayer | Updating Integrator
Fra:1 Mem:12.23M (Peak 12.83M) | Time:00:00.06 | Mem:1.63M, Peak:1.63M | Scene, ViewLayer | Updating Film
Fra:1 Mem:12.23M (Peak 12.83M) | Time:00:00.06 | Mem:1.55M, Peak:1.63M | Scene, ViewLayer | Updating Lookup Tables
Fra:1 Mem:12.23M (Peak 12.83M) | Time:00:00.06 | Mem:1.64M, Peak:1.64M | Scene, ViewLayer | Updating Baking
Fra:1 Mem:12.23M (Peak 12.83M) | Time:00:00.06 | Mem:1.64M, Peak:1.64M | Scene, ViewLayer | Updating Device | Writing constant memory
Fra:1 Mem:12.23M (Peak 12.83M) | Time:00:00.06 | Mem:1.64M, Peak:1.64M | Scene, ViewLayer | Loading denoising kernels (may take a few minutes the first time)
Fra:1 Mem:12.23M (Peak 12.83M) | Time:00:00.06 | Mem:1.64M, Peak:1.64M | Scene, ViewLayer | Sample 0/16
Fra:1 Mem:49.94M (Peak 49.94M) | Time:00:00.12 | Remaining:00:00.85 | Mem:39.21M, Peak:39.21M | Scene, ViewLayer | Sample 1/16
Fra:1 Mem:65.76M (Peak 89.49M) | Time:00:03.80 | Mem:39.21M, Peak:39.21M | Scene, ViewLayer | Sample 16/16
Fra:1 Mem:65.76M (Peak 89.49M) | Time:00:03.80 | Mem:39.21M, Peak:39.21M | Scene, ViewLayer | Finished
Saved: 'C:\tmp\0001.png'
Time: 00:04.06 (Saving: 00:00.25)


Blender quit 

*/
