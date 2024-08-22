import React from "react";
import { Popup } from "components/Popup";
import { Box, Typography } from "@mui/material";
import { CenteringWrapper } from "components/header/headerSearchBar/styled";
import { AppButton } from "components/appButton";
import openLink from "assets/icons/link-open.svg";
import { PopupLink, PopupTitle } from "components/editLogoPopup/styled";
import { useTranslation } from "react-i18next";

interface LogoAlertPopupProps {
  showPopup: boolean;
  close: () => void;
  onValidate: any;
  isUpdateText: boolean;
}

export const LogoAlertPopup = ({
  showPopup,
  close,
  onValidate,
  isUpdateText,
}: LogoAlertPopupProps) => {
  const { t } = useTranslation();
  return (
    <Popup open={showPopup} onClose={close} maxWidth={592}>
      <PopupTitle>{t("logoBroken")}</PopupTitle>
      <Typography sx={{ alignSelf: "baseline" }} mb={0.5}>
        {t("yourToken")} <span style={{ fontWeight: 700 }}>{t("noWorkingLogo")}</span>
      </Typography>
      <Typography sx={{ alignSelf: "baseline", lineHeight: 2 }}>{t("fixLater")}</Typography>
      <Box sx={{ alignSelf: "baseline" }} mx={2} mt={1}>
        <PopupLink
          href="https://github.com/ton-blockchain/minter-contract#jetton-metadata-field-best-practices"
          target="_blank">
          {t("bestLogoPractices")}
          <img alt="Open icon" src={openLink} width={11} height={11} style={{ marginLeft: 4 }} />
        </PopupLink>
      </Box>
      <CenteringWrapper mb={2}>
        <CenteringWrapper mr={2}>
          <AppButton
            height={44}
            width={98}
            fontWeight={700}
            type="button"
            transparent
            onClick={close}>
            {t("cancel")}
          </AppButton>
        </CenteringWrapper>
        <AppButton
          height={44}
          width={isUpdateText ? 140 : 98}
          fontWeight={700}
          type="button"
          onClick={() => {
            onValidate();
            close();
          }}
          background="#0088CC">
          {isUpdateText ? "Update Metadata" : "Deploy"}
        </AppButton>
      </CenteringWrapper>
    </Popup>
  );
};
