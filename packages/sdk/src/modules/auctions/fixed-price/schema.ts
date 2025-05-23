import * as v from "valibot";
import { AuctionType } from "@axis-finance/types";

const schema = v.object({
  type: v.literal(AuctionType.FIXED_PRICE_BATCH),
  price: v.bigint(),
  minFillPercent: v.number(),
});

export { schema };
