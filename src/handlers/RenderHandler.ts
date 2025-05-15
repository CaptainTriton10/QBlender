import { RenderItem } from "@/components/QueueView/Columns";
import { Command } from "@/types.ts";


class Render {
    public filename: string;
    public args: string[];
    public status: "Not Started" | "In Progress" | "Completed" | "Error";
    private blenderLocation = "C:\\Program Files\\Blender Foundation\\Blender 4.4\\blender.exe";

    public constructor(filename: string, args: string[]) {
        this.status = "Not Started";
        this.filename = filename;
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
        let renderItem: RenderItem = {
            file: this.filename.split("\\")[0],
            status: "Not Started",
            frameCount: 123,
            exportLocation: "asdf"
        };

        return renderItem;
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