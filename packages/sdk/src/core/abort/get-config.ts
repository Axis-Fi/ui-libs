import * as v from "valibot";
import { abis } from "@axis-finance/abis";
import { getAuctionHouse } from "@axis-finance/deployments";
import { schema } from "./schema";
import { SdkError } from "../../types";

import type { AbortConfig, AbortParams } from "./types";

const getConfig = (params: AbortParams): AbortConfig => {
  const parsedParams = v.safeParse(schema, params);

  if (!parsedParams.success) {
    throw new SdkError(
      "Invalid parameters supplied to getConfig()",
      parsedParams.issues,
    );
  }
  const { lotId, chainId, auctionType } = params;

  const auctionHouseAddress = getAuctionHouse({
    chainId,
    auctionType,
  })?.address;

  return {
    abi: abis.batchAuctionHouse,
    address: auctionHouseAddress,
    functionName: "abort",
    args: [BigInt(lotId)],
  };
};

export { getConfig };
