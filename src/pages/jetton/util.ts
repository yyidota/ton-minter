import { PersistenceType } from "lib/jetton-minter";
import BurnJettonsAction from "./actions/BurnJettonsAction";
import MintJettonsAction from "./actions/MintJettonsAction";
import RevokeOwnershipAction from "./actions/RevokeOwnershipAction";
import { JettonDetailMessage } from "./types";
export { BigNumber } from "bignumber.js";

const commonGithubUrl =
  "https://github.com/ton-blockchain/minter-contract#protect-yourself-and-your-users";

const offChainGithubUrl =
  "https://github.com/ton-blockchain/minter-contract#jetton-metadata-field-best-practices";

export const getFaultyMetadataWarning = (isAdminRevokedOwnership?: boolean) => {
  if (isAdminRevokedOwnership) {
    return "tokenUnusable";
  }
  return "tokenFixable";
};

export const adminActions = [RevokeOwnershipAction];

export const totalSupplyActions = [MintJettonsAction];

export const balanceActions = [BurnJettonsAction];

export const getAdminMessage = (
  adminAddress?: string,
  symbol?: string,
  isRevokedOwnership?: boolean,
  isAdmin?: boolean,
  jettonAddress?: string,
): JettonDetailMessage | undefined => {
  if (!jettonAddress) {
    return undefined;
  }
  if (isRevokedOwnership) {
    return {
      type: "success",
      text: "ownershipRevoked",
    };
  }
  if (isAdmin) {
    return {
      type: "warning",
      text: `revokeWarning`,
    };
  }

  return {
    type: "warning",
    text: `notSafeToken`,
  };
};

export const getMetadataWarning = (
  persistenceType?: PersistenceType,
  adminRevokedOwnership?: boolean,
): JettonDetailMessage | undefined => {
  if (persistenceType === "onchain" && !adminRevokedOwnership) {
    return {
      type: "warning",
      text: `adminChangeWarning`,
    };
  }
  switch (persistenceType) {
    case "offchain_ipfs":
      return {
        type: "warning",
        text: `metadataIPFS`,
      };
    case "offchain_private_domain":
      return {
        type: "warning",
        text: `metadataWebsite`,
      };

    default:
      return;
  }
};

export const getTotalSupplyWarning = (
  persistenceType?: PersistenceType,
  adminRevokedOwnership?: boolean,
): JettonDetailMessage | undefined => {
  if (persistenceType === "onchain" && !adminRevokedOwnership) {
    return {
      type: "warning",
      text: `adminMintWarning`,
    };
  }
};
