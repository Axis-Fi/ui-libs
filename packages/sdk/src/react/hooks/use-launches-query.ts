import type { QueryKey, RefetchOptions } from "@tanstack/react-query";
import { useQueries } from "@tanstack/react-query";
import type { Variables } from "graphql-request";
import {
  mainnetDeployments,
  testnetDeployments,
} from "@axis-finance/deployments";
import { GetAuctionLotsDocument, request } from "@axis-finance/subgraph-client";
import type { AuctionList } from "@axis-finance/types";
import { useSdk } from "./use-sdk";

const defaultSubgraphUrls = (isTestnet?: boolean) =>
  (isTestnet ? testnetDeployments : mainnetDeployments).map((d) => [
    d.chain.id,
    d.subgraphURL,
  ]) satisfies [number, string][];

type LaunchesQueryConfig = {
  chainIds?: number[];
  document: typeof GetAuctionLotsDocument;
  variables?: Variables;
  queryKeyFn?: (chainId: number) => QueryKey;
  isTestnet?: boolean;
};

const defaultQueryConfig: LaunchesQueryConfig = {
  document: GetAuctionLotsDocument,
  variables: {},
  queryKeyFn: (chainId: number) => ["launches", chainId] as const,
};

export const useLaunchesQuery = (
  queryConfig?: Partial<LaunchesQueryConfig>,
) => {
  const { chainIds, document, variables, queryKeyFn, isTestnet } = {
    ...defaultQueryConfig,
    ...queryConfig,
  };

  const sdk = useSdk();

  const subgraphUrls = defaultSubgraphUrls(isTestnet)
    // Ignore chains which the consumer isn't interested in
    .filter(
      ([chainId]: [number, string]) =>
        chainIds == null || chainIds?.includes(chainId),
    )
    .map(([chainId, subgraphUrl]: [number, string]) => {
      return [
        chainId,
        sdk.config.subgraph?.[chainId]?.url || subgraphUrl,
      ] satisfies [number, string];
    });

  return useQueries({
    queries: subgraphUrls.map(([chainId, subgraphUrl]: [number, string]) => ({
      queryKey: queryKeyFn?.(chainId) ?? [subgraphUrl],
      queryFn: () =>
        request<AuctionList>(subgraphUrl, document, {
          ...variables,
          chainId,
        }),
    })),
    combine: (results) => {
      const data = results
        .filter((r) => r.data?.batchAuctionLots)
        .flatMap((r) => r.data?.batchAuctionLots)
        .filter(Boolean)
        .map((r) => ({
          ...r,
          // The subgraph info fragment filters on the latest
          // info record, so we just need to take the first array item to
          // treat info as an object instead of an array. Consumers are
          // only interested in the latest auction metadata.
          info: r?.info?.[0],
        }));

      return {
        data,
        queries: results,
        refetch: (opts?: RefetchOptions) => results.map((r) => r.refetch(opts)),
        isSuccess: results.some((r) => r.isSuccess),
        isRefetching: results.some((r) => r.isFetching),
        isLoading: results.some((r) => r.isLoading),
        isError: results.some((r) => r.isError),
        errors: results.filter((r) => r.isError).map((r) => r.error),
      };
    },
  });
};
