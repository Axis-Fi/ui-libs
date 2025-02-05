import { deployments } from "@axis-finance/deployments";
import { useGetBatchAuctionLotsByBaseTokenAddressQuery } from "@axis-finance/subgraph-client";

/** Fetches auctions on a specific chain by base token address */
export function useLaunchByAddressQuery(
  chainId: number,
  baseTokenAddress: string,
) {
  const endpoint = deployments[chainId].subgraphURL;

  return useGetBatchAuctionLotsByBaseTokenAddressQuery(
    { endpoint },
    { baseTokenAddress },
  );
}
