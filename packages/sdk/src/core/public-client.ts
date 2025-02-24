import { createPublicClient, http, type PublicClientConfig } from "viem";
import * as chains from "viem/chains";
import { SdkError } from "../types";
import { getChainById } from "./utils";

const createClient = (chainId: number, config?: PublicClientConfig) => {
  const chain = getChainById(chains, chainId);

  if (chain === undefined) {
    throw new SdkError(`Chain with id ${chainId} not found`);
  }

  return createPublicClient({
    chain,
    transport: http(),
    ...config,
  });
};

export { createClient };
