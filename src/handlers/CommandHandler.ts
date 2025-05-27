import { MutableRefObject } from "react";
import { Command } from "../types.ts";

function RunCommand(
    hasRun: MutableRefObject<boolean>, 
    command: Command, 
    callback: (data: string) => void, 
    errorCallback?: () => void) {


    if (hasRun.current) { return; }
    hasRun.current = true;

    // @ts-expect-error
    window.run_command.runCommand(command.command, command.args);

    // @ts-expect-error
    window.run_command.onCommandStdout((data: string) => {
        callback(data);
    });

    // @ts-expect-error
    window.run_command.onCommandStderr((error: string) => {
        console.log(error)
        if (errorCallback) errorCallback();
    })

    hasRun.current = false;
}

export { RunCommand };