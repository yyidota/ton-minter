import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import { getStorageLng, setStorageLng } from "./storage";
import { i18n_langs, getBrowserLang } from "./config";

// 获取浏览器语言并转换为小写
const browserLang = getBrowserLang();
console.log("browserLang", browserLang);
const lng = getStorageLng() || browserLang;
const lng1 = i18n_langs.includes(lng) ? lng : "en-us";

const transformLangCode = (code = "en-us") => {
  const [lang, region] = code.split("-");
  if (!region) {
    return `${lang.toLowerCase()}`;
  }
  return `${lang.toLowerCase()}-${region.toUpperCase()}`;
};

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    backend: {
      loadPath: `/locales/{{lng}}/{{ns}}.json?t=${Date.now()}`,
    },
    fallbackLng: transformLangCode(lng1),
    lng: transformLangCode(lng1),
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["querystring", "cookie", "localStorage", "sessionStorage", "navigator"],
      caches: ["cookie"],
    },
  });
export const langs = i18n_langs;
export default i18n;
