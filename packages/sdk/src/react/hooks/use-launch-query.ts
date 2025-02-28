import type { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import {
  type GetBatchAuctionLotQuery,
  useGetBatchAuctionLotQuery,
} from "@axis-finance/subgraph-client";
import { deployments } from "@axis-finance/deployments";
import type { AuctionInfo } from "@axis-finance/types";
import { getLaunchId } from "../../core/utils";
import { useSdk } from "./use-sdk";

type QueryData = NonNullable<GetBatchAuctionLotQuery["batchAuctionLot"]>;
type QueryOptions = Omit<
  UseQueryOptions<GetBatchAuctionLotQuery, Error, QueryData>,
  "queryKey"
>;
// Auction metadata (`info`) is updatable, meaning the subgraph
// stores info as an array of historic objects. The consumer only
// needs to know the latest auction metadata, so we transform the
// data to treat info as an object (latest) instead of an array.
type TransformedQueryData = Omit<QueryData, "info"> & { info?: AuctionInfo };

type LaunchQueryConfig = {
  chainId: number;
  lotId: number;
  options?: Partial<QueryOptions>;
};

export const useLaunchQuery = ({
  chainId,
  lotId,
  options,
}: LaunchQueryConfig): UseQueryResult<TransformedQueryData, Error> => {
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
