import * as v from "valibot";
import { AuctionType } from "@axis-finance/types";

export const schema = v.object({
  lotId: v.number(),
  bidId: v.number(),
  bidIndex: v.number(),
  chainId: v.number(),
  auctionType: v.optional(v.enum_(AuctionType)),
});
