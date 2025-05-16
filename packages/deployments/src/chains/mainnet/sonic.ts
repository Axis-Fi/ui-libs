import { sonic } from "viem/chains";
import type { AxisDeploymentConfig } from "../../types";
import core from "../../axis-core/.sonic.json";
import periphery from "../../axis-periphery/.sonic.json";
import { extractAddresses, extractCallbacks } from "../helpers";
import { usdc } from "../../tokens/common";

const config: AxisDeploymentConfig = {
  name: "sonic",
  chain: sonic,
  chainIconUrl: "/sonic-logo.png",
  subgraphURL:
    "https://subgraph.satsuma-prod.com/44c4cc082f74/spaces-team/axis-origin-sonic/version/v<VERSION>/api",
  rpcURL:
    "https://sonic-mainnet.g.alchemy.com/v2/h6OEviwRZGmTSXHYPRmMquo5u-YoWLeY",
  tokenList: [
    {
      ...usdc,
      address: "0x29219dd400f2Bf60E5a23d13Be72B486D4038894",
    },
    {
      name: "Wrapped Sonic",
      symbol: "wS",
      logoURI: `https://assets.coingecko.com/coins/images/38108/standard/200x200_Sonic_Logo.png`,
      decimals: 18,
      address: "0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38",
    },
  ],
  ...extractAddresses(core),
  ...extractCallbacks(periphery),
};

export default config;
