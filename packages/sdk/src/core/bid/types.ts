import * as v from "valibot";
import { abis } from "@axis-finance/abis";
import { schema } from "./schema";
import type { ContractConfig } from "../../types";

type BidParams = v.InferOutput<typeof schema>;
type BidConfig = ContractConfig<typeof abis.batchAuctionHouse, "bid">;

type EncryptBidParams = Pick<
  BidParams,
  | "lotId"
  | "amountIn"
  | "amountOut"
  | "chainId"
  | "bidderAddress"
  | "auctionType"
>;

export type { BidParams, BidConfig, EncryptBidParams };
