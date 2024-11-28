import * as v from "valibot";
import { abis } from "@axis-finance/abis";
import { schema } from "./schema";
import type { ContractConfig } from "../../types";

type AbortParams = v.InferOutput<typeof schema>;
type AbortConfig = ContractConfig<typeof abis.batchAuctionHouse, "abort">;

export type { AbortParams, AbortConfig };
