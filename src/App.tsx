import { styled, ThemeProvider } from "@mui/material";
import { Box } from "@mui/system";
import { createContext, useEffect, useState } from "react";
import { APP_GRID, ROUTES } from "consts";
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { DeployerPage, Jetton } from "pages";
import analytics from "services/analytics";
import { Footer } from "components/footer";
import { Header } from "components/header";
import { useJettonLogo } from "hooks/useJettonLogo";
import useNotification from "hooks/useNotification";
import { lightTheme, darkTheme } from "./theme";
import "./i18n"; // 引入 i18n 配置
import { useTranslation } from "react-i18next";
import RouterView from "router";
import { setStorageLng } from "i18n/storage";

// analytics.init();

const AppWrapper = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  overflowY: "scroll",
}));

const FooterBox = styled(Box)(() => ({
  display: "flex",
  flex: 1,
  alignItems: "flex-end",
  justifyContent: "center",
}));

const ScreensWrapper = styled(Box)({
  "*::-webkit-scrollbar": {
    display: "none",
  },
  "*::-webkit-scrollbar-track": {
    display: "none",
  },
  "*::-webkit-scrollbar-thumb": {
    display: "none",
  },
});

const FlexibleBox = styled(Box)(({ theme }) => ({
  maxWidth: APP_GRID,
  width: "calc(100% - 50px)",
  marginLeft: "auto",
  marginRight: "auto",

  [theme.breakpoints.down("sm")]: {
    width: "calc(100% - 30px)",
  },
}));

export const EnvContext = createContext({
  isSandbox: false,
  isTestnet: false,
});

const PageNotFound = () => {
  const { showNotification } = useNotification();

  useEffect(() => {
    showNotification("Page not found", "error");
  }, []);

  return <Box />;
};

interface ContentWrapperProps {
  children?: any;
}

const ContentWrapper = ({ children }: ContentWrapperProps) => {
  return (
    <FlexibleBox>
      {children}
      <Outlet />
    </FlexibleBox>
  );
};

const App = () => {
  const { resetJetton } = useJettonLogo();
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  const [currentLanguage, setCurrentLanguage] = useState(`${i18n.language}`.toLocaleLowerCase());

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng); // 更改 i18n 的语言
    const currentPath = location.pathname;
    const newPath = currentPath.replace(/^\/[^\/]+/, `/${lng}`); // 替换路径中的语言部分
    setStorageLng(lng);
    setCurrentLanguage(lng);
    navigate(newPath, { replace: true }); // 导航到新的地址，不添加历史记录
  };

  // useEffect(() => {
  //   const pathSegments = location.pathname.split('/');
  //   const detectedLang = pathSegments[1];

  //   // 如果没有检测到语言或语言不在支持的语言列表中，则重定向到默认语言
  //   if (!detectedLang || !i18n.languages.includes(detectedLang)) {
  //     const defaultLanguage = 'en'; // 默认语言设置为 'en'
  //     i18n.changeLanguage(defaultLanguage);
  //     const newPath = `/${defaultLanguage}${location.pathname}`;

  //     // 确保路径不同才进行跳转，避免死循环
  //     if (newPath !== location.pathname) {
  //       navigate(newPath, { replace: true });
  //     }
  //   } else if (detectedLang !== i18n.language) {
  //     // 如果路径中的语言与 i18n 当前语言不一致，更新语言
  //     i18n.changeLanguage(detectedLang);
  //     setCurrentLanguage(detectedLang);
  //   }
  // }, [location.pathname, i18n.language, navigate]);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <AppWrapper>
        <EnvContext.Provider
          value={{
            isSandbox: window.location.search.includes("sandbox"),
            isTestnet: window.location.search.includes("testnet"),
          }}>
          <ScreensWrapper>
            <Header
              toggleTheme={toggleTheme}
              isDarkMode={isDarkMode}
              currentLanguage={currentLanguage}
              changeLanguage={changeLanguage}
            />
            <RouterView />
          </ScreensWrapper>
        </EnvContext.Provider>
        <FooterBox mt={5}>
          <Footer />
        </FooterBox>
      </AppWrapper>
    </ThemeProvider>
  );
};

export default App;
