import { base } from "viem/chains";
import type { AxisDeploymentConfig } from "../../types";
import core from "../../axis-core/.base.json";
import periphery from "../../axis-periphery/.base.json";
import { extractCallbacks, extractAddresses } from "../helpers";
import { usdc, weth } from "../../tokens/common";

const config: AxisDeploymentConfig = {
  name: "base",
  chain: base,
  chainIconUrl: "/base-logo.png",
  subgraphURL:
    "https://api.goldsky.com/api/public/project_clu16lu24lqh201x9f0qh135t/subgraphs/axis-origin-base/<VERSION>/gn",
  rpcURL:
    "https://base-mainnet.g.alchemy.com/v2/h6OEviwRZGmTSXHYPRmMquo5u-YoWLeY",
  wrapperContract: "0x4200000000000000000000000000000000000006",
  tokenList: [
    {
      ...usdc,
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    },
    {
      ...weth,
      address: "0x4200000000000000000000000000000000000006",
    },
  ],
  ...extractAddresses(core),
  ...extractCallbacks(periphery),
};

export default config;
