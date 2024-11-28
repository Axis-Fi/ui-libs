import * as v from "valibot";
import { getAuctionHouse } from "@axis-finance/deployments";
import { abis } from "@axis-finance/abis";
import { schema } from "./schema";
import { SdkError } from "../../types";
import type { CancelConfig, CancelParams } from "./types";

const getConfig = (params: CancelParams): CancelConfig => {
  const parsedParams = v.safeParse(schema, params);

  if (!parsedParams.success) {
    throw new SdkError(
      "Invalid parameters supplied to getConfig()",
      parsedParams.issues,
    );
  }

  const { chainId, lotId, callback, auctionType } = params;

  const auctionHouse = getAuctionHouse({ chainId, auctionType });

  return {
    abi: abis.batchAuctionHouse,
    address: auctionHouse.address,
    functionName: "cancel",
    args: [BigInt(lotId), callback ?? "0x"],
  };
};

export { getConfig };
