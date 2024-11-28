import { AuctionType } from "@axis-finance/types";
import * as v from "valibot";

const schema = v.object({
  lotId: v.number(),
  chainId: v.number(),
  auctionType: v.enum_(AuctionType),
});

export { schema };
