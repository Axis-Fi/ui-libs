import * as v from "valibot";
import { abis } from "@axis-finance/abis";
import { getAuctionHouse } from "@axis-finance/deployments";
import { schema } from "./schema";
import { SdkError } from "../../types";

import type { RefundBidConfig, RefundBidParams } from "./types";

const getConfig = (params: RefundBidParams): RefundBidConfig => {
  const parsedParams = v.safeParse(schema, params);

  if (!parsedParams.success) {
    throw new SdkError(
      "Invalid parameters supplied to getConfig()",
      parsedParams.issues,
    );
  }
  const { lotId, bidId, bidIndex, chainId, auctionType } = params;

  const auctionHouseAddress = getAuctionHouse({
    chainId,
    auctionType,
  })?.address;

  return {
    abi: abis.batchAuctionHouse,
    address: auctionHouseAddress,
    functionName: "refundBid",
    args: [BigInt(lotId), BigInt(bidId), BigInt(bidIndex)],
  };
};

export { getConfig };
