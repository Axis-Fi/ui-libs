import type { AxisCallbackAddresses, AxisContractAddresses } from "@repo/types";
import { allDeployments } from "./main";
import { abis } from "@repo/abis";

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
