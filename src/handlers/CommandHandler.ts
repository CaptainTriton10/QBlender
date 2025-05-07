async function RunCommand(command: string) {
    // @ts-ignore
    const result = await window.electron.runCommand(command);

    return result;
}

export default RunCommand;