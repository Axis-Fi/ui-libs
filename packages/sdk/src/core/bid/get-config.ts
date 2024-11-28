import * as v from "valibot";
import { AuctionType } from "@axis-finance/types";
import type { CloakClient } from "@axis-finance/cloak";
import { abis } from "@axis-finance/abis";
import { getAuctionHouse } from "@axis-finance/deployments";
import { SdkError } from "../../types";
import { schema } from "./schema";
import type { BidConfig, BidParams, EncryptBidParams } from "./types";
import { getEncryptedBid } from "./utils";
import { encodeEncryptedBid } from "./utils";
import { toHex } from "viem";

const getConfig = async (
  params: BidParams,
  cloak: CloakClient,
): Promise<BidConfig> => {
  const parsedParams = v.safeParse(schema, params);

  if (!parsedParams.success) {
    throw new SdkError(
      "Invalid parameters supplied to getConfig()",
      parsedParams.issues,
    );
  }

  const {
    lotId,
    amountIn,
    amountOut,
    bidderAddress,
    referrerAddress,
    chainId,
    auctionType,
    callbackData,
  } = params;

  const auctionHouseAddress = getAuctionHouse({
    chainId,
    auctionType,
  })?.address;

  if (auctionHouseAddress === undefined || auctionHouseAddress === "0x") {
    throw new SdkError(
      `Auction house contract address not found for chainId ${chainId} and auctionType ${auctionType}`,
    );
  }

  const shouldEncryptBid = auctionType === AuctionType.SEALED_BID;

  const paramsToEncrypt = {
    lotId,
    amountIn,
    amountOut,
    chainId,
    bidderAddress,
    auctionType,
  } satisfies EncryptBidParams;

  const encryptedBid = shouldEncryptBid
    ? encodeEncryptedBid(await getEncryptedBid(paramsToEncrypt, cloak))
    : undefined;

  return {
    abi: abis.batchAuctionHouse,
    address: auctionHouseAddress,
    functionName: "bid",
    args: [
      {
        lotId: BigInt(lotId),
        bidder: bidderAddress,
        referrer: referrerAddress,
        amount: amountIn,
        auctionData: encryptedBid || toHex(""),
        permit2Data: toHex(""), // TODO: handle permit2Data
      },
      callbackData,
    ],
  };
};

export { getConfig };
