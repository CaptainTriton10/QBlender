import { MutableRefObject } from 'react';
import { Command } from '../types.ts';

function runCommand(
  hasRun: MutableRefObject<boolean>,
  command: Command,
  callback: (data: string) => void,
  closedCallback?: () => void,
  errorCallback?: () => void,
) {
  if (hasRun.current) {
    return;
  }
  hasRun.current = true;

  // @ts-expect-error
  window.run_command.runCommand(command.command, command.args);

  // @ts-expect-error
  window.run_command.onCommandStdout((data: string) => {
    callback(data);
  });

  // @ts-expect-error
  window.run_command.onCommandStderr((error: string) => {
    console.log(error);
    if (errorCallback) errorCallback();
  });

  //@ts-expect-error
  window.run_command.onCommandClosed(() => {
    if (closedCallback) closedCallback();
  });

  hasRun.current = false;
}

export { runCommand };
