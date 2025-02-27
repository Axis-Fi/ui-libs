import * as v from "valibot";
import { schema as registerAuctionSchema } from "../../registry/register-auction/schema";
import { schema as setMerkleRootSchema } from "../../periphery/callbacks/set-merkle-root/schema";

const _registerAuctionSchema = v.omit(registerAuctionSchema, ["ipfsCID"]);

export const schema = v.object({
  ..._registerAuctionSchema.entries,
  ...setMerkleRootSchema.entries,
});
