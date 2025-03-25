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
    "https://subgraph.satsuma-prod.com/44c4cc082f74/spaces-team/axis-origin-sepolia/version/v<VERSION>/api",
  rpcURL:
    "https://eth-sepolia.g.alchemy.com/v2/h6OEviwRZGmTSXHYPRmMquo5u-YoWLeY",
  wrapperContract: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
  tokenList: [
    {
      ...usdc,
      address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
      decimals: 18,
    },
    {
      ...weth,
      address: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    },
  ],
  ...extractAddresses(core),
};

export default config;
