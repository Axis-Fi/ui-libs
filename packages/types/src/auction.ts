import type { GetAuctionLotsQuery } from "@axis-finance/subgraph-client";
import { AuctionType } from "./auction-modules";
import type { Address } from "./axis-contracts";
import type { BatchSubgraphAuction } from "./subgraph-queries";
import type { Token } from "./token";

export type BaseAuction = {
  chainId: number;
  baseToken: Token;
  quoteToken: Token;
  callbacks: Address;
  status: AuctionStatus;
  auctionType: AuctionType;
  formatted?: AuctionFormattedInfo;
  /** Whether the auction passes the malicious auction verification */
  isSecure?: boolean;

  // Used for registration launches
  registrationDeadline?: Date;
  fdv?: number;

  // We remap the info array into an object, since we're only interested in the latest
  info?: AuctionInfo;
};

export type AuctionStatus =
  | "created"
  | "cancelled"
  | "live"
  | "concluded"
  | "decrypted"
  | "aborted"
  | "settled";

export type AuctionInfo = NonNullable<BatchSubgraphAuction["info"]>[number];

export type BatchAuction = BaseAuction &
  Omit<BatchSubgraphAuction, "baseToken" | "quoteToken" | "info">;

export type Auction = BatchAuction;

// Auction metadata (`info`) is updatable, meaning the subgraph
// stores info as an array of historic objects. The consumer only
// needs to know the latest auction metadata, so we transform the
// data to treat info as an object (latest) instead of an array.
export type UseLaunchQueryReturn = Omit<BatchSubgraphAuction, "info"> & {
  info?: AuctionInfo;
};

/**
 * Patched auction lots query that treats callbacks as Address
 * and transforms the info array into an object, since we're only interested in the latest
 * and removes the allowlist from the info object, as it could be too data heavy
 * to send to the consumer.
 **/
export type AuctionListItem = Omit<
  GetAuctionLotsQuery["batchAuctionLots"][number],
  "info" | "callbacks"
> & {
  callbacks: Address;
  info?:
    | NonNullable<
        GetAuctionLotsQuery["batchAuctionLots"][number]["info"]
      >[number]
    | null;
};

export type AuctionLinkId =
  | "website"
  | "payoutTokenLogo"
  | "projectLogo"
  | "projectBanner"
  | "discord"
  | "website"
  | "farcaster"
  | "twitter"
  | "externalSite";

export type AuctionLink = AuctionInfo["links"][number];

export type AuctionFormattedInfo = {
  startDate: Date;
  endDate: Date;
  startFormatted: string;
  endFormatted: string;
  startDistance: string;
  endDistance: string;
  rate?: string;
  purchased: string;
  purchasedDecimal: number;
  sold: string;
  minPrice?: string;
  minBidSize?: string;
  tokenPairSymbols: string;
  capacity: string;
  totalSupply: string;
  price?: string;
  auctionType?: string;
} & Partial<EMPFormattedInfo>;

export type EMPFormattedInfo = {
  marginalPrice: string;
  marginalPriceDecimal: number;
  totalBids: number;
  totalBidsDecrypted: number;
  totalBidsClaimed: number;
  totalBidAmountFormatted: string;
  totalBidAmountDecimal: number;
  minFilled: string;
  uniqueBidders: number;
  cleared: boolean;
  rate: string;
  minPrice: string;
  minBidSize: string;
};

export type FPBFormattedInfo = {
  price: string;
  totalBids: number;
  totalBidsClaimed: number;
  totalBidAmountFormatted: string;
  totalBidAmountDecimal: number;
  uniqueBidders: number;
  cleared: boolean;
  minFilled: string;
};

export type PropsWithAuction = {
  auction: Auction;
};

export type AuctionId = `${string}-${string}-${number}`;
