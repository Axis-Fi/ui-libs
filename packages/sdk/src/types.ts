import * as v from "valibot";
import { initTRPC } from "@trpc/server";
import type {
  Abi,
  AbiParametersToPrimitiveTypes,
  Address,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from "abitype";
import { AuctionMetadataSchema } from "./core/create/schema";
import type { CreateTRPCProxyClient } from "@trpc/client";
import { Environment } from "@axis-finance/env";
import { MetadataClient, MetadataClientConfig } from "./utils/metadata-client";

class SdkError<TInput> extends Error {
  issues?: v.BaseIssue<TInput>[] | undefined;

  constructor(
    message: string,
    issues: v.BaseIssue<TInput>[] | undefined = undefined,
  ) {
    super(message);
    this.name = "OriginSdkError";
    this.issues = issues;
  }
}

type ContractFunctionParams<
  TAbi extends Abi,
  TFunctionName extends string,
> = AbiParametersToPrimitiveTypes<
  ExtractAbiFunction<TAbi, TFunctionName>["inputs"],
  "inputs"
>;

type ContractFunctionReturn<TAbi extends Abi, TFunctionName extends string> =
  AbiParametersToPrimitiveTypes<
    ExtractAbiFunction<TAbi, TFunctionName>["outputs"],
    "outputs"
  > extends infer OutputArray
    ? OutputArray extends readonly [] // If the function has no return value, return undefined
      ? undefined
      : OutputArray extends readonly [infer SingleOutput] // If the function has a single return value, unwrap it
        ? SingleOutput
        : OutputArray // Otherwise, return the array of return values
    : void;

type ContractConfig<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
> = {
  abi: Abi;
  address: Address;
  functionName: TFunctionName;
  args: ContractFunctionParams<TAbi, TFunctionName>;
};

type OriginConfig = {
  environment: Environment;
  cloak: {
    url: string;
  };
  metadata?: MetadataClientConfig;
  curator: {
    url: string;
  };
  subgraph?: {
    [chainId: number]: {
      url: string;
    };
  };
};

/**
 * Type-safe tRPC client for the IPFS API.
 * TODO: this duplication avoids circular ref by not importing from an `/app` package.
 * Eventually curator-api could pull schema from this package.
 */
const t = initTRPC.create({
  isServer: false,
  allowOutsideOfServer: true,
});

export const CuratorProfileSchema = v.object({
  curatorProfilePayload: v.string(),
  ipfsCid: v.string(),
});

const router = t.router({
  storeAuctionInfo: t.procedure
    .input(v.parser(AuctionMetadataSchema))
    .output(v.parser(v.string()))
    .mutation(() => ""),
  bustAxisFollowingCache: t.procedure
    .input(v.parser(v.object({ pwd: v.string() })))
    .query(() => true),
  axisFollowing: t.procedure.input(v.parser(v.void())).query(() => true),
  getSigningSignatureForCurator: t.procedure
    .input(v.parser(CuratorProfileSchema))
    .output(
      v.parser(
        v.object({
          signature: v.string(),
        }),
      ),
    )
    .mutation(() => ({
      signature: "",
    })),
});

type CuratorRouter = typeof router;

type CuratorClient = CreateTRPCProxyClient<CuratorRouter>;

export type {
  OriginConfig,
  ContractConfig,
  ContractFunctionReturn,
  CuratorClient,
  CuratorRouter,
};

export { SdkError, MetadataClient };
