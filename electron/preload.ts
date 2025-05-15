import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
    on(...args: Parameters<typeof ipcRenderer.on>) {
        const [channel, listener] = args
        return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
    },
    off(...args: Parameters<typeof ipcRenderer.off>) {
        const [channel, ...omit] = args
        return ipcRenderer.off(channel, ...omit)
    },
    send(...args: Parameters<typeof ipcRenderer.send>) {
        const [channel, ...omit] = args
        return ipcRenderer.send(channel, ...omit)
    },
    invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
        const [channel, ...omit] = args
        return ipcRenderer.invoke(channel, ...omit)
    },

    // You can expose other APTs you need here.
    // ...
})

contextBridge.exposeInMainWorld('open_file', {
    openFile: () => ipcRenderer.invoke('open_file')
});

contextBridge.exposeInMainWorld("run_command", {
    runCommand: (command: string, args: string[]) =>
        ipcRenderer.send("run_command", command, args),

    onCommandStdout: (callback: Function) =>
        ipcRenderer.on("stdout", (_event, data) => callback(data))
});

contextBridge.exposeInMainWorld("store", {
    setStore: (key: string, value: JSON | string) =>
        ipcRenderer.invoke("set_store", key, value),

    getStore: (key: string) =>
        ipcRenderer.invoke("get_store", key)
})