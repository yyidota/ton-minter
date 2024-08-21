import { createTheme, Theme } from "@mui/material/styles";

// 声明模块扩展，以便使用 `DefaultTheme`
declare module "@mui/material" {
  interface DefaultTheme extends Theme {}
}

// 明亮模式主题
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0088CC",
      contrastText: "#fff",
    },
    secondary: {
      main: "#313855",
    },
    text: {
      primary: "#313855",
      secondary: "#000000",
    },
    error: {
      main: "#ef5350",
    },
    warning: {
      main: "#FF5147",
    },
    action: {
      active: "#ffffff",
      hover: "#000000",
      disabledBackground: "#B2B2B2",
      disabled: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#f5f5f5",
    },
  },
  typography: {
    fontFamily: "mulish, sans-serif",
    button: {
      textTransform: "none",
    },
  },
});

// 暗夜模式主题
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#0088CC",
      contrastText: "#fff",
    },
    secondary: {
      main: "#313855",
    },
    text: {
      primary: "#ffffff",
      secondary: "#B2B2B2",
    },
    error: {
      main: "#ef5350",
    },
    warning: {
      main: "#FF5147",
    },
    action: {
      active: "#ffffff",
      hover: "#B2B2B2",
      disabledBackground: "#313855",
      disabled: "#4F4F4F",
    },
    background: {
      default: "#121212",
      paper: "#1D1D1D",
    },
  },
  typography: {
    fontFamily: "mulish, sans-serif",
    button: {
      textTransform: "none",
    },
  },
});

// 默认导出 lightTheme，或者你也可以选择导出 darkTheme
export default lightTheme;
export { darkTheme, lightTheme };
