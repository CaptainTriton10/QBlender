import { MutableRefObject } from "react";
import { Command } from "../types.ts";

type CommandCallback = (data: string) => void;

function RunCommand(hasRun: MutableRefObject<boolean>, command: Command, callback: CommandCallback) {
    if (hasRun.current) { return; }
    hasRun.current = true;

    // @ts-ignore
    window.run_command.runCommand(command.command, command.args);

    // @ts-ignore
    window.run_command.onCommandStdout((data: string) => {
        callback(data);
    });

    hasRun.current = false;
}

export { RunCommand };