import { RenderItem } from "@/components/QueueView/Columns";
import { Command } from "@/types.ts";


class Render {
    public filename: string;
    public args: string[];
    public status: "Not Started" | "In Progress" | "Completed" | "Error";
    public exportLocation: string;
    private blenderLocation = "C:\\Program Files\\Blender Foundation\\Blender 4.4\\blender.exe";

    public constructor(filename: string, args: string[], exportLocation: string) {
        this.status = "Not Started";
        this.filename = filename;
        this.exportLocation = exportLocation;
        this.args = args;
    }

    public Command() {
        let command: Command = { command: this.blenderLocation, args: ["-b", this.filename] };

        this.args.forEach(arg => {
            command.args.push(arg);
        });

        console.log(command);

        return command;
    }

    public ToRenderItem() {
        const splitFilename = this.filename.split("\\");

        let renderItem: RenderItem = {
            file: splitFilename[splitFilename.length - 1].slice(0, -6),
            status: "Not Started",
            frameCount: 123,
            exportLocation: this.exportLocation
        };

        return renderItem;
    }

    public Render() {

    }

    public ToString() {
        let command: string = `./\"${this.blenderLocation}\" -b \"${this.filename}\"`;

        this.args.forEach(arg => {
            command += ` ${arg}`;
        });

        return command;
    }
}

export default Render;

/*
-b = background rendering
-a = render animation
-o = output location
-F = render format
-x = add extension (bool)
--cycles-print-stats = memory stats etc
*/