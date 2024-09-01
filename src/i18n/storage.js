export function setStorageLng(lng) {
  window.localStorage.setItem("i18nLng", lng);
}

export function getStorageLng() {
  return window.localStorage.getItem("i18nLng");
}
