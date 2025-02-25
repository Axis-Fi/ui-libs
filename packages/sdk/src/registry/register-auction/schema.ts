import * as v from "valibot";
import { AddressSchema, IPFSCIDV1Schema } from "../../core/schema";

export const schema = v.object({
  auctionHouse: AddressSchema,
  lotId: v.number(),
  ipfsCID: IPFSCIDV1Schema,
  isTestnet: v.boolean(),
});
