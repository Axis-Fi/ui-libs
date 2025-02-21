import * as v from "valibot";
import { schema } from "./schema";
import type { ContractConfig } from "../../../types";
import { abis } from "@axis-finance/abis";

export type SetMerkleRootParams = v.InferOutput<typeof schema>;
export type SetMerkleRootConfig = ContractConfig<
  typeof abis.merkleAllowlist,
  "setMerkleRoot"
>;
