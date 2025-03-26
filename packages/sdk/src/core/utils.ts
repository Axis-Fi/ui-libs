import { type Chain } from "viem";
import { type AxisDeployments, deployments } from "@axis-finance/deployments";
import type {
  Address,
  AuctionId,
  AxisContractAddresses,
} from "@axis-finance/types";

const getContractAddresses = (
  chainId: number,
  deployments: AxisDeployments,
): AxisContractAddresses => {
  return deployments[chainId!]?.addresses;
};

const getChainById = (
  chains: Record<string, Chain>,
  chainId: number,
): Chain | undefined => {
  return chains
    ? Object.values(chains).find((chain) => chain.id === chainId)
    : undefined;
};

const getDeploymentByChainId = (chainId: number) => {
  const deployment = deployments[chainId];

  if (!deployment)
    throw new Error(`Unable to find deployment for chainId ${chainId}`);

  return deployment;
};

const formatChainName = (str: string) => str.toLowerCase().replace(/ /g, "-");

const formatAuctionId = (
  chainName: string,
  auctionHouseAddress: Address,
  lotId: number,
): AuctionId => {
  const formattedChainName = formatChainName(chainName);
  return `${formattedChainName}-${auctionHouseAddress.toLowerCase()}-${lotId}`;
};

const getLaunchId = (chainId: number, lotId: number) => {
  const deployment = getDeploymentByChainId(chainId);
  return formatAuctionId(
    deployment.name,
    deployment.addresses.batchAuctionHouse,
    lotId,
  );
};

export {
  getContractAddresses,
  getChainById,
  getDeploymentByChainId,
  getLaunchId,
};
