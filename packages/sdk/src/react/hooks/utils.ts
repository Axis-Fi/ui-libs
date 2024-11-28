import { axisContracts } from "@axis-finance/deployments";

export function getAuctionHouseAddress({ chainId }: { chainId: number }) {
  if (chainId == null) return undefined;

  return axisContracts.addresses[chainId].batchAuctionHouse;
}
