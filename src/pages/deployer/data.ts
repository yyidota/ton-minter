import { checkImageURL, checkDecimals } from "helpers";

const onchainFormSpec = [
  {
    name: "name",
    label: "jettonName",
    description: "projectName",
    type: "text",
    default: "Bitcoin Cash",
    required: true,
    errorMessage: "nameRequired",
  },
  {
    name: "symbol",
    label: "jettonSymbol",
    description: "currencySymbol",
    type: "text",
    default: "BCH",
    required: true,
    errorMessage: "symbolRequired",
  },
  {
    name: "decimals",
    label: "jettonDecimals",
    description: "decimalsInfo",
    type: "number",
    validate: checkDecimals,
    default: 9,
    showDefault: true,
    required: true,
    errorMessage: "decimalsRequired", // https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#jetton-metadata-attributes
  },
  {
    name: "mintAmount",
    label: "tokensToMint",
    description: "mintAmountInfo",
    type: "number",
    default: 21000000,
    required: true,
    errorMessage: "mintAmountRequired",
  },
  {
    name: "description",
    label: "description",
    description: "projectInfo",
    type: "string",
    default: "projectExample",
  },

  {
    name: "tokenImage",
    label: "logoURL",
    description: "logoURLInfo",
    type: "string",
    required: false,
    validate: checkImageURL,
    default: "https://bitcoincash-example.github.io/website/logo.png",
  },
];

const offchainFormSpec = [
  {
    name: "offchainUri",
    label: "offchainURI",
    description: "jsonInfo",
    type: "string",
    default: "",
    required: true,
    errorMessage: "uriRequired",
  },
  {
    name: "mintAmount",
    label: "amountToMint",
    description: "amountInfo",
    type: "number",
    default: 21000000,
    required: true,
    errorMessage: "mintAmountRequired",
    disabled: undefined,
  },
];

export { onchainFormSpec, offchainFormSpec };
