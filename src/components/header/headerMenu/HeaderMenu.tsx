import { Box, Drawer, FormControl, IconButton, MenuItem, Select, styled } from "@mui/material";
import githubIcon from "assets/icons/github-logo.svg";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { AppLogo } from "components/appLogo";
import {
  CloseMenuButton,
  DrawerContent,
  StyledGithubIcon,
  AppMenu,
  HeaderTypography,
} from "./styled";
import { TonConnectButton } from "@tonconnect/ui-react";
import Brightness4Icon from "@mui/icons-material/Brightness4"; // 添加的图标
import Brightness7Icon from "@mui/icons-material/Brightness7"; // 添加的图标

interface MenuProps {
  closeMenu?: () => void;
  toggleTheme?: () => void;
  showMenu?: boolean;
  isDarkMode: boolean;
  currentLanguage: string;
  changeLanguage: (language: string) => void;
}

const MobileMenu: React.FC<MenuProps> = ({
  closeMenu,
  showMenu,
  toggleTheme,
  isDarkMode,
  currentLanguage,
  changeLanguage,
}) => {
  return (
    <Drawer anchor="left" open={showMenu} onClose={closeMenu}>
      <CloseMenuButton onClick={closeMenu}>
        <CloseRoundedIcon style={{ width: 30, height: 30 }} />
      </CloseMenuButton>
      <DrawerContent>
        <AppLogo />
        <HeaderMenu
          showMenu={showMenu}
          closeMenu={closeMenu}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          currentLanguage={currentLanguage}
          changeLanguage={changeLanguage}
        />
      </DrawerContent>
    </Drawer>
  );
};

const HeaderMenu: React.FC<MenuProps> = (props) => {
  const { toggleTheme, isDarkMode, currentLanguage, changeLanguage } = props;

  console.log("currentLanguage", currentLanguage);
  return (
    <AppMenu>
      <div onClick={props.closeMenu}>
        <StyledTonConnectButton />
      </div>
      {/* <IconButton
        sx={{ padding: 0, ml: 1.5 }}
        href="https://github.com/ton-blockchain/minter"
        target="_blank">
        <StyledGithubIcon width={20} height={20} src={githubIcon} />
        <HeaderTypography variant="h5">GitHub</HeaderTypography>
      </IconButton> */}
      {/* 添加主题切换按钮 */}
      {/* <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="primary">
        {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton> */}
      {/* 语言切换下拉菜单 */}

      <StyledSelect
        value={currentLanguage}
        onChange={(event: any) => changeLanguage(event.target.value)}
        displayEmpty
        inputProps={{ "aria-label": "Without label" }}>
        <StyledMenuItem value="en-us">EN</StyledMenuItem>
        <StyledMenuItem value="zh-cn">中文</StyledMenuItem>
      </StyledSelect>
    </AppMenu>
  );
};

const StyledTonConnectButton = styled(TonConnectButton)(({ theme }) => ({
  button: {
    background: theme.palette.primary.main,
    "*": { color: "white" },
    svg: {
      "*": {
        stroke: "white",
      },
    },
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main, // 使用主题主颜色作为背景颜色
  color: "#fff", // 文本颜色
  height: 38, // 设置与 TonConnectButton 一致的高度
  borderRadius: theme.shape.borderRadius, // 确保按钮圆角一致
  padding: "0 8px", // 设置内边距确保内容居中
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: theme.palette.primary.main, // 边框颜色与背景色一致
  },
  "& .MuiSvgIcon-root": {
    color: "#fff", // 下拉图标颜色
  },
  "& .MuiMenuItem-root": {
    backgroundColor: theme.palette.primary.main, // 菜单项背景颜色
    color: "#fff", // 菜单项文本颜色
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  backgroundColor: "#fff", // 默认背景色
  color: "#000", // 默认文本色
  "&:hover": {
    backgroundColor: "#f0f0f0", // Hover 时的背景色
    color: "#333", // Hover 时的文本色
  },
}));

export { HeaderMenu, MobileMenu };
