import * as v from "valibot";
import { setMerkleRoot } from "../../periphery/callbacks";
import { registerAuction } from "../../registry";
import { MetadataClient } from "../metadata-client";
import { schema } from "./schema";
import { SdkError } from "../../types";
import { getAuctionLot } from "../get-auction-lot";
import { deployments } from "@axis-finance/deployments";
import type { OriginConfig } from "../../types";
import { UpdateAllowlistParams, UpdateAllowlistResult } from "./types";
import { Address, isAddress } from "viem";

export const getConfig = async (
  params: UpdateAllowlistParams,
  metadataClient: MetadataClient,
  subgraph?: OriginConfig["subgraph"],
): Promise<UpdateAllowlistResult> => {
  const parsedParams = v.safeParse(schema, params);

  if (!parsedParams.success) {
    throw new SdkError(
      "Invalid parameters supplied to getConfig()",
      parsedParams.issues,
    );
  }

  const { lotId, auctionHouse, allowlist, chainId } = params;

  const subgraphEndpoint = subgraph
    ? subgraph[chainId].url
    : deployments[chainId].subgraphURL;

  const { chain } = deployments[chainId];
  const isTestnet = !!chain.testnet;

  const result = await getAuctionLot({
    endpoint: subgraphEndpoint,
    lotId,
  });

  const auction = result.batchAuctionLot;

  if (!auction) {
    throw new SdkError(`Auction with ${lotId} not found on ${chainId}`);
  }

  if (!isAddress(auction.callbacks)) {
    throw new SdkError(`Provided Auction doesn't have a callback address`);
  }

  const metadata = { ...auction.info, allowlist };

  const ipfsCID = await metadataClient.save({
    metadata: JSON.stringify(metadata),
    id: auction.info?.key ?? undefined,
  });

  const registerAuctionConfig = registerAuction.getConfig({
    ipfsCID,
    lotId,
    auctionHouse,
    isTestnet,
  });

  const setMerkleRootConfig = setMerkleRoot.getConfig({
    lotId,
    allowlist,
    callback: auction.callbacks as Address,
  });

  return { registerAuctionConfig, setMerkleRootConfig };
};
