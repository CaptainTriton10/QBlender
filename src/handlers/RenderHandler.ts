import { RenderItem } from "@/components/QueueView/Columns";
import { blenderLocation } from "@/lib/utils";
import { Command } from "@/types.ts";
import { RunCommand } from "./CommandHandler";

type RenderSettings = {
    isAnimation: boolean;
    frame?: number;
    exportName: string;
    renderFormat: string;
}

class Render {
    public filename: string;
    public settings: RenderSettings;
    public frameCount: number;
    public status: "Not Started" | "In Progress" | "Completed" | "Error";
    public exportLocation: string[];

    public constructor(filename: string, exportLocation: string[], frame?: number) {
        this.status = "Not Started";
        this.filename = filename;
        this.exportLocation = exportLocation;
        this.frameCount = -1;
        this.settings = {
            isAnimation: false,
            frame: frame,
            exportName: filename,
            renderFormat: "PNG"
        };
    }

    public Command() {
        const animationOrFrame = (this.settings.isAnimation) ? "-a" : "-f";
        const frame = this.settings.frame;
        const exportFile = `${this.exportLocation}/test.png`; //TODO: Update this

        let command: Command = {
            command: blenderLocation, args: [
                "-b", this.filename,
                "-o", exportFile,
                "-F", this.settings.renderFormat,
                "-x",
                animationOrFrame
            ]
        };

        if (this.settings.frame) command.args.push(String(frame));

        return command;
    }

    public ToRenderItem() {
        const splitFilename = this.filename.split("\\");

        let renderItem: RenderItem = {
            file: splitFilename[splitFilename.length - 1].slice(0, -6),
            status: this.status,
            frameCount: this.frameCount,
            exportLocation: this.exportLocation
        };

        return renderItem;
    }

    public async Render(
        hasRun: React.MutableRefObject<boolean>,
        callback: (data: string) => void,
        closedCallback: () => void,
        errorCallback: (filename: string) => void
    ) {

        const command = this.Command();
        console.log("Rendering blender file: ", this.filename);

        console.log(command);

        this.status = "In Progress";

        RunCommand(hasRun, command, callback, () => {
            closedCallback();
            this.status = "Completed";
        }, () => {
            errorCallback(this.filename);
            this.status = "Error";
        });
    }

    /**@deprecated */
    public ToString() {
        let command: string = `\"${blenderLocation}\" -b \"${this.filename}\"`;

        // this.args.forEach(arg => {
        //     command += ` ${arg}`;
        // });

        return command;
    }
}

export default Render;