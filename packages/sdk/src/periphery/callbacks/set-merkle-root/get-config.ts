import * as v from "valibot";
import { schema } from "./schema";
import { SetMerkleRootParams, SetMerkleRootConfig } from "./types";
import { generateMerkleRoot } from "../../../utils/merkle-tree/generate-merkle-root";
import { SdkError } from "../../../types";
import { abis } from "@axis-finance/abis";

export const getConfig = (params: SetMerkleRootParams): SetMerkleRootConfig => {
  const parsedParams = v.safeParse(schema, params);

  if (!parsedParams.success) {
    throw new SdkError(
      "Invalid parameters supplied to getConfig()",
      parsedParams.issues,
    );
  }

  const { lotId, callback, allowlist } = params;

  const merkleRoot = generateMerkleRoot(allowlist);

  return {
    abi: abis.merkleAllowlist,
    address: callback,
    functionName: "setMerkleRoot",
    args: [BigInt(lotId), merkleRoot],
  };
};
