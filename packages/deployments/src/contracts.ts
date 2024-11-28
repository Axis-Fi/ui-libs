import type {
  AxisCallbackAddresses,
  AxisContractAddresses,
} from "@axis-finance/types";
import { allDeployments } from "./main";
import { abis } from "@axis-finance/abis";

const addressesPerChain: Record<
  number,
  AxisContractAddresses & AxisCallbackAddresses
> = allDeployments.flat().reduce((acc, deployment) => {
  return {
    ...acc,
    [deployment.chain.id]: { ...deployment.addresses, ...deployment.callbacks },
  };
}, {});

export const axisContracts = {
  addresses: addressesPerChain,
  abis,
};
