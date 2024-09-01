import { Box, styled } from "@mui/material";
import { APP_GRID, ROUTES } from "consts";
import { Outlet } from "react-router-dom";
interface ContentWrapperProps {
  children?: any;
}
const FlexibleBox = styled(Box)(({ theme }) => ({
  maxWidth: APP_GRID,
  width: "calc(100% - 50px)",
  marginLeft: "auto",
  marginRight: "auto",

  [theme.breakpoints.down("sm")]: {
    width: "calc(100% - 30px)",
  },
}));

const ContentWrapper = ({ children }: ContentWrapperProps) => {
  return (
    <FlexibleBox>
      {children}
      <Outlet />
    </FlexibleBox>
  );
};

export default ContentWrapper;
