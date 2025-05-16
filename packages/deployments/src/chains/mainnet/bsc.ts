import { bsc } from "viem/chains";
import type { AxisDeploymentConfig } from "../../types";
import { usdc } from "../../tokens/common";
import core from "../../axis-core/.bsc.json";
import periphery from "../../axis-periphery/.bsc.json";
import { extractAddresses, extractCallbacks } from "../helpers";

const config: AxisDeploymentConfig = {
  name: "bsc",
  chain: bsc,
  chainIconUrl: "/bsc.webp",
  subgraphURL:
    "https://subgraph.satsuma-prod.com/44c4cc082f74/spaces-team/axis-origin-bsc/version/v<VERSION>/api",
  rpcURL:
    "https://bnb-mainnet.g.alchemy.com/v2/h6OEviwRZGmTSXHYPRmMquo5u-YoWLeY",
  tokenList: [
    {
      ...usdc,
      address: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
      decimals: 6,
    },
    {
      name: "Wrapped BNB",
      symbol: "WBNB",
      logoURI:
        "https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png",
      decimals: 18,
      address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
    },
  ],
  ...extractAddresses(core),
  ...extractCallbacks(periphery),
};

export default config;
