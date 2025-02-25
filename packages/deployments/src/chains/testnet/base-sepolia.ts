import { baseSepolia } from "viem/chains";
import type { AxisDeploymentConfig } from "../../types";
import { weth, usdc } from "../../tokens/common";
import core from "../../axis-core/.base-sepolia.json";
import periphery from "../../axis-periphery/.base-sepolia.json";
import { extractAddresses, extractCallbacks } from "../helpers";
import registry from "../../axis-utils/.base-sepolia.json";
import { Address } from "@axis-finance/types";

const config: AxisDeploymentConfig = {
  name: "base-sepolia",
  chain: baseSepolia,
  chainIconUrl: "/base-logo.png",
  subgraphURL:
    "https://api.goldsky.com/api/public/project_clu16lu24lqh201x9f0qh135t/subgraphs/axis-origin-base-sepolia/<VERSION>/gn",
  rpcURL:
    "https://base-sepolia.g.alchemy.com/v2/h6OEviwRZGmTSXHYPRmMquo5u-YoWLeY",
  wrapperContract: "0x4200000000000000000000000000000000000006", //WETH9
  tokenList: [
    {
      ...usdc,
      address: "0x4c9d75fbdf764d05df654340a48f85bc0216f8ab",
      decimals: 18,
      mintable: true,
    },
    {
      ...weth,
      address: "0x5384c9408f65978b4318a95b70af383ca06f1cf0",
      mintable: true,
    },
  ],
  ...extractAddresses(core),
  ...extractCallbacks(periphery),
  registry: registry["deployments.utils.registry"][0] as Address,
};

export default config;
