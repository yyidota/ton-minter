import { AppButton } from "components/appButton";
import { useTranslation } from "react-i18next";
import { onConnect } from "utils";

function ConnectAction() {
  const { t } = useTranslation();
  return <AppButton onClick={onConnect}>{t("connectWallet")}</AppButton>;
}

export default ConnectAction;
