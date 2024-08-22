import useNotification from "hooks/useNotification";
import { jettonDeployController } from "lib/deploy-controller";
import WalletConnection from "services/wallet-connection";
import useJettonStore from "store/jetton-store/useJettonStore";
import { Address } from "ton";
import { AppButton } from "components/appButton";
import { useSetRecoilState } from "recoil";
import { jettonActionsState } from "pages/jetton/actions/jettonActions";
import { useState } from "react";
import { CenteringWrapper } from "components/footer/styled";
import { Popup } from "components/Popup";
import { Typography } from "@mui/material";
import bullet from "assets/icons/bullet.svg";
import error from "assets/icons/error-notification.svg";
import { Box } from "@mui/system";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { useTranslation } from "react-i18next";

function RevokeOwnershipAction() {
  const [actionInProgress, setActionInProgress] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { jettonMaster, isAdmin, getJettonDetails, isMyWallet, symbol, isImageBroken } =
    useJettonStore();
  const walletAddress = useTonAddress();
  const [tonconnect] = useTonConnectUI();
  const { showNotification } = useNotification();
  const { t } = useTranslation();
  if (!isAdmin || !isMyWallet) {
    return null;
  }

  const onClick = async () => {
    setShowAlert(true);
  };

  const onSubmit = async () => {
    setShowAlert(false);
    try {
      if (!jettonMaster) {
        return;
      }
      setActionInProgress(true);
      await jettonDeployController.burnAdmin(
        Address.parse(jettonMaster),
        tonconnect,
        walletAddress,
      );
      getJettonDetails();
      showNotification("Ownership revoked successfully", "success");
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message, "error");
      }
    } finally {
      setActionInProgress(false);
    }
  };
  return (
    <>
      <Popup open={showAlert} maxWidth={600} onClose={() => setShowAlert(false)}>
        <Box ml={3} mt={-1} mb={-0.6} sx={{ alignSelf: "baseline", color: "#464646" }}>
          <Typography
            sx={{
              color: "#161C28",
              fontWeight: 800,
              fontSize: 20,
              marginBottom: 3.2,
              textAlign: "center",
            }}>
            {t("revokeOwnership")}
          </Typography>
          <Typography sx={{ fontWeight: 500, marginBottom: 2.2 }}>
            {t("revokeNotice")} <span style={{ fontWeight: 900 }}>{symbol}</span>
            {t("revokeInfo")}
          </Typography>
          <ul
            style={{
              listStyleImage: `url(${bullet})`,
              paddingLeft: 20,
              fontWeight: 500,
              marginBottom: 0,
            }}>
            <li style={{ marginBottom: 10 }}>
              <span style={{ paddingLeft: 5 }}>{t("changeLogo")}</span>
              {isImageBroken && (
                <CenteringWrapper ml="5px" sx={{ justifyContent: "flex-start" }}>
                  <img
                    src={error}
                    width={10}
                    height={10}
                    alt="Error icon"
                    style={{ marginRight: 5 }}
                  />
                  <span style={{ color: "#FC5656", fontSize: 12, fontWeight: 500 }}>
                    {t("logoWarning")}
                  </span>
                </CenteringWrapper>
              )}
            </li>
            <li style={{ marginBottom: 10 }}>
              <span style={{ paddingLeft: 5 }}>
                {t("mintMore")} <span style={{ fontWeight: 900 }}>{symbol}</span>
              </span>
            </li>
            <li style={{ marginBottom: 10 }}>
              <span style={{ paddingLeft: 5 }}>{t("changeName")}</span>
            </li>
            <li style={{ marginBottom: 10 }}>
              <span style={{ paddingLeft: 5 }}>{t("changeDescription")}</span>
            </li>
          </ul>
          <Typography textAlign="left" sx={{ fontWeight: 700 }}>
            {t("revokeFinalized")}
          </Typography>
        </Box>
        <CenteringWrapper>
          <Box mr={4.2}>
            <AppButton transparent width={100} onClick={() => setShowAlert(false)}>
              {t("cancel")}
            </AppButton>
          </Box>
          <AppButton loading={actionInProgress} width={100} onClick={onSubmit}>
            {t("revoke")}
          </AppButton>
        </CenteringWrapper>
      </Popup>
      <AppButton loading={actionInProgress} transparent={true} onClick={onClick}>
        {t("revokeOwnership")}
      </AppButton>
    </>
  );
}

export default RevokeOwnershipAction;
