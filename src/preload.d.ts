export {};

declare global {
  interface Window {
    open_file: {
      openFile: (isFile: boolean, fileExtensions?: string[]) => Promise<string[]>;
    };
    run_command: {
      runCommand: (command: string, args: string[]) => void;
      onCommandStdout: (callback: (data: string) => void) => void;
      onCommandStderr: (callback: (error: string) => void) => void;
      onCommandClosed: (callback: () => void) => void;
    };
    store: {
      getStore: (key: string) => any;
      setStore: (key: string, value: any) => void;
    };
    get_os: {
      getOS: () => 'windows' | 'linux' | 'macos' | 'unknown';
    };
  }
}
