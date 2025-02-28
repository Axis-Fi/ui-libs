import { deployments } from "@axis-finance/deployments";
import { useGetBatchAuctionLotsByBaseTokenAddressQuery } from "@axis-finance/subgraph-client";

/** Fetches auctions on a specific chain by base token address */
export function useTokenLaunchesQuery(
  chainId: number,
  baseTokenAddress: string,
) {
  const endpoint = deployments[chainId].subgraphURL;

  return useGetBatchAuctionLotsByBaseTokenAddressQuery(
    { endpoint },
    { baseTokenAddress },
    {
      select: (data) =>
        data.batchAuctionLots.map((auction) => ({
          ...auction,
          // The subgraph info fragment filters on the latest
          // info record, so we just need to take the first array item to
          // treat info as an object instead of an array. Consumers are
          // only interested in the latest auction metadata.
          info: auction?.info?.[0],
        })),
    },
  );
}
