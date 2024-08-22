import { useState } from "react";
import { Address } from "ton";
import { Box, Fade, Link, Typography } from "@mui/material";
import { jettonDeployController, JettonDeployParams } from "lib/deploy-controller";
import WalletConnection from "services/wallet-connection";
import { createDeployParams } from "lib/utils";
import { ContractDeployer } from "lib/contract-deployer";
import { Link as ReactRouterLink } from "react-router-dom";
import { ROUTES } from "consts";
import useNotification from "hooks/useNotification";
import {
  FormWrapper,
  ScreenHeading,
  StyledDescription,
  StyledTxLoaderContent,
  SubHeadingWrapper,
} from "./styles";
import { Screen, ScreenContent } from "components/Screen";
import analytics, { AnalyticsAction, AnalyticsCategory } from "services/analytics";
import { getUrlParam, toDecimalsBN } from "utils";
import { offchainFormSpec, onchainFormSpec } from "./data";
import { Form } from "components/form";
import { GithubButton } from "pages/deployer/githubButton";
import { useNavigatePreserveQuery } from "lib/hooks/useNavigatePreserveQuery";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { useTranslation } from "react-i18next";

const DEFAULT_DECIMALS = 9;

const isOffchainInternal = getUrlParam("offchainINTERNAL") !== null;

let formSpec = isOffchainInternal ? offchainFormSpec : onchainFormSpec;

async function fetchDecimalsOffchain(url: string): Promise<{ decimals?: string }> {
  let res = await fetch(url);
  let obj = await res.json();
  return obj;
}

function DeployerPage() {
  const { showNotification } = useNotification();
  const walletAddress = useTonAddress();
  const [tonconnect] = useTonConnectUI();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigatePreserveQuery();
  const { t } = useTranslation();

  async function deployContract(data: any) {
    if (!walletAddress || !tonconnect) {
      throw new Error("Wallet not connected");
    }

    let decimals = data.decimals;
    if (data.offchainUri) {
      let res = await fetchDecimalsOffchain(
        data.offchainUri.replace("ipfs://", "https://ipfs.io/ipfs/"),
      );
      decimals = res.decimals;
    }
    console.log("owner", walletAddress);
    const params: JettonDeployParams = {
      owner: Address.parse(walletAddress),
      onchainMetaData: {
        name: data.name,
        symbol: data.symbol,
        image: data.tokenImage,
        description: data.description,
        decimals: parseInt(decimals).toFixed(0),
      },
      offchainUri: data.offchainUri,
      amountToMint: toDecimalsBN(data.mintAmount, decimals ?? DEFAULT_DECIMALS),
    };
    setIsLoading(true);

    const deployParams = createDeployParams(params, data.offchainUri);
    const contractAddress = new ContractDeployer().addressForContract(deployParams);

    const isDeployed = await WalletConnection.isContractDeployed(contractAddress);

    if (isDeployed) {
      showNotification(
        <>
          {t("contractAlreadydeployed")}{" "}
          <ReactRouterLink to={`${ROUTES.jetton}/${Address.normalize(contractAddress)}/`}>
            {t("viewContract")}
          </ReactRouterLink>
        </>,
        "warning",
      );
      setIsLoading(false);
      return;
    }

    try {
      const result = await jettonDeployController.createJetton(params, tonconnect, walletAddress);
      // analytics.sendEvent(
      //   AnalyticsCategory.DEPLOYER_PAGE,
      //   AnalyticsAction.DEPLOY,
      //   contractAddress.toFriendly(),
      // );

      navigate(`${ROUTES.jetton}/${Address.normalize(result)}`);
    } catch (err) {
      if (err instanceof Error) {
        showNotification(<>{err.message}</>, "error");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Screen>
      <ScreenContent removeBackground>
        <Fade in>
          <Box>
            <Box mb={3} mt={3.75}>
              <ScreenHeading variant="h5">{t("mintToken")}</ScreenHeading>
            </Box>
            <FormWrapper>
              <SubHeadingWrapper>
                <Form
                  isLoading={isLoading}
                  submitText={t("deploy")}
                  onSubmit={deployContract}
                  inputs={formSpec}
                />
              </SubHeadingWrapper>
              {/* <Box sx={{ flex: 4 }}>
                <Description />
              </Box> */}
            </FormWrapper>
          </Box>
        </Fade>
      </ScreenContent>
    </Screen>
  );
}

export { DeployerPage };
