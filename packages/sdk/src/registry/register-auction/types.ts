import * as v from "valibot";
import { schema } from "./schema";
import { ContractConfig } from "../../types";
import { abis } from "@axis-finance/abis";

type RegisterAuctionParams = v.InferOutput<typeof schema>;
type RegisterAuctionConfig = ContractConfig<
  typeof abis.axisMetadataRegistry,
  "registerAuction"
> & { chainId: number };

export type { RegisterAuctionParams, RegisterAuctionConfig };
