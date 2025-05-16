import { monadTestnet } from "viem/chains";
import type { AxisDeploymentConfig } from "../../types";
import { weth, usdc } from "../../tokens/common";
import core from "../../axis-core/.monad-testnet.json";
import periphery from "../../axis-periphery/.monad-testnet.json";
import { extractAddresses, extractCallbacks } from "../helpers";

const config: AxisDeploymentConfig = {
  name: "monad-testnet",
  chain: monadTestnet,
  chainIconUrl: "/monad.svg",
  subgraphURL:
    "https://subgraph.satsuma-prod.com/44c4cc082f74/spaces-team/axis-origin-monad-testnet/version/v<VERSION>/api",
  rpcURL:
    "https://monad-testnet.g.alchemy.com/v2/h6OEviwRZGmTSXHYPRmMquo5u-YoWLeY",
  tokenList: [
    {
      ...usdc,
      address: "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea",
      decimals: 6,
    },
    {
      ...weth,
      address: "0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37",
    },
  ],
  ...extractAddresses(core),
  ...extractCallbacks(periphery),
};

export default config;
