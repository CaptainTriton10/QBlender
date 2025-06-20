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

  window.run_command.runCommand(command.command, command.args);

  window.run_command.onCommandStdout((data: string) => {
    callback(data);
  });

  window.run_command.onCommandStderr((error: string) => {
    console.log(error);
    if (errorCallback) errorCallback();
  });

  window.run_command.onCommandClosed(() => {
    if (closedCallback) closedCallback();
  });

  hasRun.current = false;
}

export { runCommand };
