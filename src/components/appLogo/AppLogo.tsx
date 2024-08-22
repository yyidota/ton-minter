import { Chip, Typography } from "@mui/material";
import { APP_DISPLAY_NAME, ROUTES } from "consts";
import logo from "assets/icons/logo.svg";
import { LogoWrapper, ImageWrapper } from "./styled";
import { useNetwork } from "lib/hooks/useNetwork";
import { useNavigatePreserveQuery } from "lib/hooks/useNavigatePreserveQuery";
import { useTranslation } from "react-i18next";

export const AppLogo = () => {
  const navigate = useNavigatePreserveQuery();
  const { network } = useNetwork();
  const { t } = useTranslation();
  return (
    <LogoWrapper onClick={() => navigate(ROUTES.deployer)}>
      <ImageWrapper>
        <img src={"/img/logo.svg"} alt="Logo" />
      </ImageWrapper>
      <Typography variant="h4">{APP_DISPLAY_NAME}</Typography>
      {network === "testnet" && <Chip sx={{ ml: 1 }} label={t("testnet")} />}
    </LogoWrapper>
  );
};
