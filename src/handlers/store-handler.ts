function setStore(key: string, value: JSON | string) {
  window.store.setStore(key, value);
}

function getStore(key: string) {
  const value = window.store.getStore(key);

  return value;
}

export { setStore, getStore };
