import { base } from "viem/chains";
import type { AxisDeploymentConfig } from "../../types";
import core from "../../axis-core/.base.json";
import periphery from "../../axis-periphery/.base.json";
import { extractCallbacks, extractAddresses } from "../helpers";
import { usdc, weth } from "../../tokens/common";
import registry from "../../axis-utils/.base.json";
import { Address } from "@axis-finance/types";

const config: AxisDeploymentConfig = {
  name: "base",
  chain: base,
  chainIconUrl: "/base-logo.png",
  subgraphURL:
    "https://subgraph.satsuma-prod.com/44c4cc082f74/spaces-team/axis-origin-base/version/v<VERSION>/api",
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
  registry: registry["deployments.utils.registry"][0] as Address,
};

export default config;
