export const i18n_langs = ["en-us", "zh-cn"];

export const browserLangToStandard = (lang: any) => {
  const lowerLang = lang.toLowerCase();

  // 定义语言映射
  const langMap: any = {
    en: "en-us",
    zh: "zh-cn",
    // 'zh-hans': 'zh-cn',
    // 'zh-hant': 'zh-hk',
    // 'ru': 'ru-ru',
    // 'tr': 'tr-tr',
    // 'ja': 'ja-jp',
    // 'fr': 'fr-fr',
    // 'de': 'de-de',
    // 'es': 'es-es'
  };

  // 如果直接匹配
  if (i18n_langs.includes(lowerLang)) {
    return lowerLang;
  }

  // 尝试找到最接近的匹配
  for (const key in langMap) {
    if (lowerLang.startsWith(key)) {
      return langMap[key];
    }
  }

  // 如果没有匹配，返回默认语言
  return "en-us";
};

export const getBrowserLang = () => {
  const browserLang = navigator.language || navigator.languages[0];
  return browserLangToStandard(browserLang);
};
