import * as v from "valibot";
import { schema } from "./schema";
import type { RegisterAuctionConfig, RegisterAuctionParams } from "./types";
import { SdkError } from "../../types";
import { abis } from "@axis-finance/abis";
import { deployments } from "@axis-finance/deployments";
import { base, baseSepolia } from "viem/chains";

export const getConfig = (
  params: RegisterAuctionParams,
): RegisterAuctionConfig => {
  const parsedParams = v.safeParse(schema, params);

  if (!parsedParams.success) {
    throw new SdkError(
      "Invalid parameters supplied to getConfig()",
      parsedParams.issues,
    );
  }
  const chain = params.isTestnet ? baseSepolia : base;

  const deployment = deployments[chain.id];

  const { lotId, auctionHouse, ipfsCID } = params;

  return {
    chainId: chain.id,
    address: deployment.registry!,
    abi: abis.axisMetadataRegistry,
    functionName: "registerAuction",
    args: [auctionHouse, BigInt(lotId), ipfsCID],
  };
};
