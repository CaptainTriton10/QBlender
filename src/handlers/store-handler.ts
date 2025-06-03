function setStore(key: string, value: JSON | string) {
  // @ts-ignore
  window.store.setStore(key, value);
}

function getStore(key: string) {
  // @ts-ignore
  const value = window.store.getStore(key);

  return value;
}

export { setStore, getStore };
