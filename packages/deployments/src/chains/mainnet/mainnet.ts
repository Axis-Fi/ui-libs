import { mainnet } from "viem/chains";
import { dai, usdc, usdt, weth, lusd } from "../../tokens/common";
import { AxisDeploymentConfig } from "../../types";
import core from "../../axis-core/.mainnet.json";
import utils from "../../axis-utils/.mainnet.json";
import { extractAddresses, extractUtils } from "../helpers";

const config: AxisDeploymentConfig = {
  name: "mainnet",
  chain: mainnet,
  chainIconUrl: "/mainnet-logo.png",
  subgraphURL:
    "https://subgraph.satsuma-prod.com/44c4cc082f74/spaces-team/axis-origin-mainnet/version/v<VERSION>/api",
  rpcURL:
    "https://eth-mainnet.g.alchemy.com/v2/h6OEviwRZGmTSXHYPRmMquo5u-YoWLeY",
  wrapperContract: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  tokenList: [
    {
      ...dai,
      address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    {
      ...usdc,
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    },
    {
      ...usdt,
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    },
    {
      ...lusd,
      address: "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0",
    },
    {
      ...weth,
      address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
  ],
  ...extractAddresses(core),
  ...extractUtils(utils),
};

export default config;
