import { Typography } from "@mui/material";
import BigNumberDisplay from "components/BigNumberDisplay";
import { Popup } from "components/Popup";
import useNotification from "hooks/useNotification";
import { jettonDeployController } from "lib/deploy-controller";
import { useState } from "react";
import WalletConnection from "services/wallet-connection";
import useJettonStore from "store/jetton-store/useJettonStore";
import { Address } from "ton";
import { toDecimalsBN } from "utils";
import { AppButton } from "components/appButton";
import { AppNumberInput } from "components/appInput";
import { useRecoilState } from "recoil";
import { jettonActionsState } from "pages/jetton/actions/jettonActions";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { useTranslation } from "react-i18next";

function MintJettonsAction() {
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [tonconnect] = useTonConnectUI();
  const { jettonMaster, isAdmin, symbol, getJettonDetails, isMyWallet, decimals } =
    useJettonStore();
  const walletAddress = useTonAddress();
  const { showNotification } = useNotification();
  const { t } = useTranslation();

  if (!isAdmin || !isMyWallet) {
    return null;
  }

  const onMint = async () => {
    if (!jettonMaster) {
      return;
    }

    if (!amount || amount === 0) {
      showNotification(
        t("minMintAmount", {
          symbol: symbol,
        }),
        "warning",
      );
      return;
    }
    const value = toDecimalsBN(amount, decimals!);

    try {
      setActionInProgress(true);
      await jettonDeployController.mint(
        tonconnect,
        Address.parse(jettonMaster),
        value,
        walletAddress,
      );
      setOpen(false);
      const message = (
        <>
          {t("mintSuccess")} <BigNumberDisplay value={amount} /> {symbol}
        </>
      );
      getJettonDetails();
      showNotification(message, "success");
    } catch (error) {
      console.log(error);
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
            {t("mint")} {symbol}
          </Typography>
          <AppNumberInput
            label={t("enterAmount", {
              symbol,
            })}
            value={amount}
            onChange={(value: number) => setAmount(value)}
          />
          <AppButton onClick={onMint}>{t("submit")}</AppButton>
        </>
      </Popup>
      <AppButton loading={actionInProgress} transparent={true} onClick={() => setOpen(true)}>
        {t("mint")}
      </AppButton>
    </>
  );
}

export default MintJettonsAction;
