import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import {
  type GetBatchAuctionLotQuery,
  useGetBatchAuctionLotQuery,
} from "@repo/subgraph-client";
import { deployments } from "@repo/deployments";
import { getLaunchId } from "../../core/utils";
import { useSdk } from "./use-sdk";

type QueryData = GetBatchAuctionLotQuery["batchAuctionLot"];
type QueryOptions = Omit<
  UseQueryOptions<GetBatchAuctionLotQuery, Error, QueryData>,
  "queryKey"
>;

type LaunchQueryConfig = {
  chainId: number;
  lotId: number;
  options?: Partial<QueryOptions>;
};

export const useLaunchQuery = ({
  chainId,
  lotId,
  options,
}: LaunchQueryConfig): UseQueryResult<QueryData, Error> => {
  const sdk = useSdk();
  const id = getLaunchId(chainId, lotId);
  const isQueryEnabled =
    chainId != null &&
    id != null &&
    (options?.enabled satisfies boolean | undefined);

  const subgraphUrl =
    sdk.config?.subgraph?.[chainId]?.url ?? deployments[chainId!].subgraphURL;

  return useGetBatchAuctionLotQuery(
    { endpoint: subgraphUrl },
    { id: id! },
    {
      enabled: isQueryEnabled,
      select: (data) => data.batchAuctionLot,
    },
  );
};
