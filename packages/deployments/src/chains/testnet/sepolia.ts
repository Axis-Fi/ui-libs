import { sepolia } from "viem/chains";
import type { AxisDeploymentConfig } from "../../types";
import { weth, usdc } from "../../tokens/common";
import core from "../../axis-core/.sepolia.json";
import { extractAddresses } from "../helpers";

const config: AxisDeploymentConfig = {
  name: "sepolia",
  chain: sepolia,
  chainIconUrl: "/sepolia-logo.png",
  subgraphURL:
    "https://subgraph.satsuma-prod.com/44c4cc082f74/spaces-team/axis-origin-sepolia/version/v1.0.6.3/api",
  rpcURL:
    "https://eth-sepolia.g.alchemy.com/v2/h6OEviwRZGmTSXHYPRmMquo5u-YoWLeY",
  wrapperContract: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
  tokenList: [
    {
      ...usdc,
      address: "0xf8543066281b44d909530c9b9fb6ca8f17404caf",
      decimals: 18,
      mintable: true,
    },
    {
      ...weth,
      address: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    },
  ],
  ...extractAddresses(core),
};

export default config;
