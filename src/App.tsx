import { styled, ThemeProvider } from "@mui/material";
import { Box } from "@mui/system";
import { createContext, useEffect, useState } from "react";
import { APP_GRID, ROUTES } from "consts";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { DeployerPage, Jetton } from "pages";
import analytics from "services/analytics";
import { Footer } from "components/footer";
import { Header } from "components/header";
import { useJettonLogo } from "hooks/useJettonLogo";
import useNotification from "hooks/useNotification";
import { lightTheme, darkTheme } from "./theme"; // 引入主题
import { IntlProvider } from "react-intl";
import zhCNMessages from "./locales/zh-cn.json";
import eNMessages from "./locales/en.json";

analytics.init();

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
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  const [currentLanguage, setCurrentLanguage] = useState("zh-cn"); // 默认语言设为中文

  const changeLanguage = (language: string) => {
    setCurrentLanguage(language);
    localStorage.setItem("language", language); // 持久化语言选择
  };

  useEffect(() => {
    resetJetton();
  }, [location.pathname]);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  // 获取用户语言设置
  const language = currentLanguage;
  const messages: any = {
    "zh-cn": zhCNMessages,
    en: eNMessages,
    // 其他语言文件
  };

  return (
    <IntlProvider locale={language} messages={messages[language] || messages["en"]}>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <AppWrapper>
          <EnvContext.Provider
            value={{
              isSandbox: window.location.search.includes("sandbox"),
              isTestnet: window.location.search.includes("testnet"),
            }}>
            <ScreensWrapper>
              <Routes>
                <Route
                  path="*"
                  element={
                    <>
                      <Header
                        toggleTheme={toggleTheme}
                        isDarkMode={isDarkMode}
                        currentLanguage={currentLanguage}
                        changeLanguage={changeLanguage}
                      />
                      <Navigate to="/" />
                      <PageNotFound />
                    </>
                  }
                />
                <Route
                  path="/"
                  element={
                    <Header
                      toggleTheme={toggleTheme}
                      isDarkMode={isDarkMode}
                      currentLanguage={currentLanguage}
                      changeLanguage={changeLanguage}
                    />
                  }>
                  <Route path="/" element={<ContentWrapper />}>
                    <Route path={ROUTES.deployer} element={<DeployerPage />} />
                    <Route path={ROUTES.jettonId} element={<Jetton />} />
                  </Route>
                </Route>
              </Routes>
            </ScreensWrapper>
          </EnvContext.Provider>
          <FooterBox mt={5}>
            <Footer />
          </FooterBox>
        </AppWrapper>
      </ThemeProvider>
    </IntlProvider>
  );
};

export default App;
