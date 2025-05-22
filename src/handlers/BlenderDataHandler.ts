import { blenderLocation } from "@/lib/utils";
import { RunCommand } from "./CommandHandler";
import { MutableRefObject } from "react";
import { Command } from "@/types";

const getFramesLocation = "src/blender/GetFrames.py";

async function GetFrames(hasRun: MutableRefObject<boolean>, blendFile: string) {
    return new Promise<number>((resolve, reject) => {
        let command: Command = {
            command: blenderLocation,
            args: ["-b", blendFile, "-P", getFramesLocation]
        }

        const processData = (data: string) => {
            if (!data.toLowerCase().includes("blender")) {
                const frameCount = parseInt(data);
                if (data) resolve(frameCount);
                else {
                    reject(`Unable to parse frame count: ${data}`);
                    console.log("Unable to parse frame count: ", data);
                }
            }
        }

        RunCommand(hasRun, command, processData);
    })
}

export { GetFrames };