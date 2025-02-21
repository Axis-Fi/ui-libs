import * as v from "valibot";
import { schema as merkleTreeGeneratorSchema } from "../../../utils/merkle-tree/schema";
import { AddressSchema } from "../../../core/schema";

export const schema = v.object({
  lotId: v.number(),
  callback: AddressSchema,
  allowlist: merkleTreeGeneratorSchema,
});
