import { defineConfig, type Config } from "@wagmi/cli";

import abiMap from "./src/abis/sources";

const config: Config = {
  out: "src/abis/generated.ts",
  contracts: Object.entries(abiMap).map(([name, abi]) => ({
    name,
    abi: abi.abi,
  })),
  plugins: [],
};

const defConfig: ReturnType<typeof defineConfig> = defineConfig(config);

export default defConfig;
