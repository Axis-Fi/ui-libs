import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import {
  type GetBatchAuctionLotQuery,
  useGetBatchAuctionLotQuery,
} from "@axis-finance/subgraph-client";
import { deployments } from "@axis-finance/deployments";
import type { UseLaunchQueryReturn } from "@axis-finance/types";
import { getLaunchId } from "../../core/utils";
import { useSdk } from "./use-sdk";

type QueryData = NonNullable<GetBatchAuctionLotQuery["batchAuctionLot"]>;

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
}: LaunchQueryConfig): UseQueryResult<UseLaunchQueryReturn, Error> => {
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
      select: (data) => ({
        ...data.batchAuctionLot!,
        // The subgraph info fragment filters on the latest
        // info record, so we just need to take the first array item to
        // treat info as an object instead of an array. Consumers are
        // only interested in the latest auction metadata.
        info: data.batchAuctionLot?.info?.[0],
      }),
    },
  );
};
