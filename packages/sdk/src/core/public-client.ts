import { createPublicClient, http } from "viem";
import * as chains from "viem/chains";
import { SdkError } from "../types";
import { getChainById } from "./utils";

const createClient = (chainId: number) => {
  const chain = getChainById(chains, chainId);

  if (chain === undefined) {
    throw new SdkError(`Chain with id ${chainId} not found`);
  }

  return createPublicClient({ chain, transport: http() });
};

export { createClient };
