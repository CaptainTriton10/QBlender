function SetStore(key: string, value: JSON | string) {
    // @ts-ignore
    window.store.setStore(key, value);
}

function GetStore(key: string) {
    // @ts-ignore
    const value = window.store.getStore(key);

    return value;
}

export { SetStore, GetStore };