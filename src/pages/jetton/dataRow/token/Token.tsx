import React, { useState } from "react";
import {
  StyledBlock,
  StyledCategoryFields,
  StyledTop,
  StyledTopImg,
  StyledTopText,
} from "pages/jetton/styled";
import LoadingImage from "components/LoadingImage";
import LoadingContainer from "components/LoadingContainer";
import { Box, Tooltip } from "@mui/material";
import Alert from "@mui/material/Alert";
import {
  adminActions,
  getAdminMessage,
  getFaultyMetadataWarning,
  getMetadataWarning,
  getTotalSupplyWarning,
  totalSupplyActions,
} from "pages/jetton/util";
import { DataRow } from "pages/jetton/dataRow/DataRow";
import BigNumberDisplay from "components/BigNumberDisplay";
import UpdateMetadata from "pages/jetton/actions/UpdateMetadata";
import useJettonStore from "store/jetton-store/useJettonStore";
import { AppHeading } from "components/appHeading";
import brokenImage from "assets/icons/question.png";
import { AppButton } from "components/appButton";
import pen from "assets/icons/pen.svg";
import { CenteringWrapper } from "components/footer/styled";
import { useTonAddress } from "@tonconnect/ui-react";
import { toUserFriendlyAddress } from "@tonconnect/sdk";
import { useTranslation } from "react-i18next";

export const Token = () => {
  const {
    jettonImage,
    adminAddress,
    isAdmin,
    adminRevokedOwnership,
    symbol,
    name,
    description,
    jettonMaster,
    persistenceType,
    totalSupply,
    jettonWalletAddress,
    isJettonDeployerFaultyOnChainData,
    jettonLoading,
    decimals,
    isImageBroken,
  } = useJettonStore();
  const [openEdit, setOpenEdit] = useState(false);
  const { t } = useTranslation();
  // const walletAddress = useTonAddress(false);
  // const walletAddressFormat = useTonAddress();

  // console.log('no format address', walletAddress)
  // console.log('no format address>>>',toUserFriendlyAddress(walletAddress, true))
  // console.log('no format walletAddressFormat', walletAddressFormat)

  return (
    <StyledBlock sx={{ width: "calc(55% - 15px)" }}>
      {!openEdit ? (
        <>
          <StyledTop>
            <StyledTopImg>
              <LoadingImage
                src={!isImageBroken ? jettonImage : brokenImage}
                alt="jetton image"
                loading={jettonLoading}
              />
            </StyledTopImg>
            <StyledTopText marginLeft="4px" marginTop="3px">
              <LoadingContainer loading={jettonLoading} loaderWidth="80px">
                {name && (
                  <AppHeading
                    text={`${name} ${symbol && `(${symbol})`}`}
                    variant="h2"
                    fontWeight={800}
                    fontSize={20}
                    color="#161C28"
                  />
                )}
              </LoadingContainer>
              <LoadingContainer loading={jettonLoading} loaderWidth="150px">
                <Tooltip arrow title={description && description?.length > 80 ? description : ""}>
                  <Box marginTop=".5px" sx={{ maxWidth: 300, maxHeight: 60 }}>
                    <AppHeading
                      text={description || t("description")}
                      limitText={80}
                      variant="h4"
                      fontWeight={500}
                      fontSize={16}
                      color="#728A96"
                    />
                  </Box>
                </Tooltip>
              </LoadingContainer>
            </StyledTopText>
            {isAdmin && !adminRevokedOwnership && !jettonLoading && (
              <Box sx={{ alignSelf: "start" }}>
                <AppButton width={113} height={32} transparent onClick={() => setOpenEdit(true)}>
                  <CenteringWrapper>
                    <img
                      src={pen}
                      alt="Pen Icon"
                      width={15}
                      height={15}
                      style={{ marginRight: 4 }}
                    />
                    {t("editToken")}
                  </CenteringWrapper>
                </AppButton>
              </Box>
            )}
          </StyledTop>
          {!isAdmin && isJettonDeployerFaultyOnChainData && (
            <Alert variant="filled" severity="error">
              {getFaultyMetadataWarning(adminRevokedOwnership)}
            </Alert>
          )}
          <StyledCategoryFields>
            <DataRow
              description={t("jettonParent")}
              title={t("address")}
              value={jettonMaster}
              dataLoading={jettonLoading}
              address={jettonMaster}
            />
            <DataRow
              title={t("admin")}
              value={adminRevokedOwnership ? t("emptyAddr") : adminAddress}
              address={adminAddress}
              description={t("mintingAccount")}
              message={getAdminMessage(
                jettonWalletAddress,
                symbol,
                adminRevokedOwnership,
                isAdmin,
                jettonMaster,
              )}
              dataLoading={jettonLoading}
              actions={adminActions}
              hasButton={isAdmin && !adminRevokedOwnership}
              showIcon={!isAdmin}
              regularAddress
            />
            <DataRow
              title={t("symbol")}
              value={symbol}
              dataLoading={jettonLoading}
              message={getMetadataWarning(persistenceType, adminRevokedOwnership)}
            />
            <DataRow
              title={t("decimals")}
              value={decimals}
              dataLoading={jettonLoading}
              message={getMetadataWarning(persistenceType, adminRevokedOwnership)}
            />
            <DataRow
              title={t("totalSupply")}
              value={
                totalSupply && (
                  <>
                    <BigNumberDisplay
                      value={totalSupply.toString()}
                      decimals={parseInt(decimals!)}
                    />{" "}
                    {symbol}
                  </>
                )
              }
              dataLoading={jettonLoading}
              message={getTotalSupplyWarning(persistenceType, adminRevokedOwnership)}
              actions={totalSupplyActions}
            />
          </StyledCategoryFields>
        </>
      ) : (
        <UpdateMetadata setOpen={setOpenEdit} />
      )}
    </StyledBlock>
  );
};
