import { Typography } from "@mui/material";
import BigNumberDisplay from "components/BigNumberDisplay";
import { Popup } from "components/Popup";
import useNotification from "hooks/useNotification";
import { jettonDeployController } from "lib/deploy-controller";
import { useState } from "react";
import useJettonStore from "store/jetton-store/useJettonStore";
import { AppButton } from "components/appButton";
import { AppNumberInput } from "components/appInput";
import { toDecimalsBN } from "utils";
import { useRecoilState } from "recoil";
import { jettonActionsState } from "pages/jetton/actions/jettonActions";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { useTranslation } from "react-i18next";

function BurnJettonsAction() {
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const {
    jettonMaster,
    symbol,
    getJettonDetails,
    balance,
    jettonWalletAddress,
    isMyWallet,
    decimals,
  } = useJettonStore();
  const { showNotification } = useNotification();
  const [actionInProgress, setActionInProgress] = useState(false);
  const [tonconnect] = useTonConnectUI();
  const walletAddress = useTonAddress();
  const { t } = useTranslation();
  if (!balance || !isMyWallet) {
    return null;
  }

  const onBurn = async () => {
    if (!jettonMaster) {
      return;
    }

    if (!amount || amount === 0) {
      showNotification(t("minBurnAmount", { symbol }), "warning");
      return;
    }

    const valueDecimals = toDecimalsBN(amount, decimals!);
    const balanceDecimals = toDecimalsBN(balance!!.toString(), decimals!);

    if (valueDecimals.gt(balanceDecimals)) {
      const msg = (
        <>
          {t("maxBurnAmount")} <BigNumberDisplay value={balance} />
        </>
      );
      showNotification(msg, "warning", undefined, 3000);
      return;
    }

    try {
      setActionInProgress(true);
      await jettonDeployController.burnJettons(
        tonconnect,
        valueDecimals,
        jettonWalletAddress!,
        walletAddress,
      );
      const message = `${t("burnSuccess")} ${amount.toLocaleString()} ${symbol}`;
      showNotification(message, "success");
      getJettonDetails();
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message, "error");
      }
    } finally {
      setActionInProgress(false);
      setOpen(false);
    }
  };

  const onClose = () => {
    setAmount(0);
    setOpen(false);
  };

  return (
    <>
      <Popup open={open && !actionInProgress} onClose={onClose} maxWidth={400}>
        <>
          <Typography className="title">
            {t("burn")} {symbol}
          </Typography>
          <AppNumberInput
            label={t("enterAmount", { symbol })}
            value={amount}
            onChange={(value: number) => setAmount(value)}
          />
          <AppButton onClick={onBurn}>{t("submit")}</AppButton>
        </>
      </Popup>
      <AppButton loading={actionInProgress} transparent={true} onClick={() => setOpen(true)}>
        {t("burn")}
      </AppButton>
    </>
  );
}

export default BurnJettonsAction;
