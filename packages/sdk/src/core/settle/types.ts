import * as v from "valibot";
import { abis } from "@axis-finance/abis";
import { schema } from ".";
import type { ContractConfig } from "../../types";

type SettleParams = v.InferOutput<typeof schema>;
type SettleConfig = ContractConfig<typeof abis.batchAuctionHouse, "settle">;

export type { SettleParams, SettleConfig };
