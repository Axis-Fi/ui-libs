import * as v from "valibot";

export const typeSchema = v.tupleWithRest(
  [v.literal("address")],
  v.literal("uint256"),
);

export const schema = v.object({
  types: typeSchema,
  values: v.array(v.array(v.string())),
});
