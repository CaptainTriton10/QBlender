import { RenderItem } from "@/components/QueueView/Columns";
import { blenderLocation } from "@/lib/utils";
import { Command } from "@/types.ts";


class Render {
    public filename: string;
    public args: string[];
    public frameCount: number;
    public status: "Not Started" | "In Progress" | "Completed" | "Error";
    public exportLocation: string;

    public constructor(filename: string, args: string[], exportLocation: string) {
        this.status = "Not Started";
        this.filename = filename;
        this.exportLocation = exportLocation;
        this.frameCount = -1;
        this.args = args;
    }

    public Command() {
        let command: Command = { command: blenderLocation, args: ["-b", this.filename] };

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
            frameCount: this.frameCount,
            exportLocation: this.exportLocation
        };

        return renderItem;
    }

    public Render() {

    }

    public ToString() {
        let command: string = `./\"${blenderLocation}\" -b \"${this.filename}\"`;

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