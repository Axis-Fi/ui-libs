import * as v from "valibot";
import { abis } from "@axis-finance/abis";
import { getAuctionHouse } from "@axis-finance/deployments";
import { schema } from "./schema";
import { SdkError } from "../../types";

import type { SettleConfig, SettleParams } from "./types";

const getConfig = (params: SettleParams): SettleConfig => {
  const parsedParams = v.safeParse(schema, params);

  if (!parsedParams.success) {
    throw new SdkError(
      "Invalid parameters supplied to getConfig()",
      parsedParams.issues,
    );
  }
  const { lotId, numBids, chainId, callbackData, auctionType } = params;

  const auctionHouseAddress = getAuctionHouse({
    chainId,
    auctionType,
  })?.address;

  return {
    abi: abis.batchAuctionHouse,
    address: auctionHouseAddress,
    functionName: "settle",
    args: [BigInt(lotId), BigInt(numBids), callbackData],
  };
};

export { getConfig };
