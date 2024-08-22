import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import zhCNMessages from "./locales/zh-CN.json";
import enMessages from "./locales/en.json";

// 初始化 i18next
i18n
  .use(LanguageDetector) // 检测用户语言
  .use(initReactI18next) // 绑定 react-i18next
  .init({
    resources: {
      en: {
        translation: enMessages,
      },
      "zh-CN": {
        translation: zhCNMessages,
      },
    },
    fallbackLng: "en", // 找不到语言时的回退语言
    debug: true, // 调试模式
    interpolation: {
      escapeValue: false, // react 已经自动转义，不需要此功能
    },
  });

export default i18n;
