import type { Address } from "viem";
import { baseSepolia, mainnet } from "viem/chains";

const registry =
  // TODO: pull this from deployments package once they're stored in there
  process.env.NODE_ENV === "production"
    ? {
        // ethereum mainnet
        address: "0x7020638419355ae9fb5a124c580a05226aea9158" as Address,
        chain: mainnet,
      }
    : {
        // base testnet
        address: "0xc94404218178149ebebfc1f47f0df14b5fd881c5" as Address,
        chain: baseSepolia,
      };

export { registry };
