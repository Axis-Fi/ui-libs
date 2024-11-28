import { describe, it, expect, vi } from "vitest";
import { zeroAddress } from "viem";
import { abis } from "@axis-finance/abis";
import { AuctionType } from "@axis-finance/types";
import { getConfig } from "./get-config";
import type { RefundBidConfig, RefundBidParams } from "./types";

const mockAddress = zeroAddress;

vi.mock("@axis-finance/deployments", () => ({
  getAuctionHouse: vi.fn(() => getAuctionHouseMock),
}));

const getAuctionHouseMock = {
  abi: abis.batchAuctionHouse,
  address: mockAddress,
};

const mockParams = {
  lotId: 1,
  bidId: 1,
  bidIndex: 1,
  chainId: 1,
  auctionType: AuctionType.SEALED_BID,
} satisfies RefundBidParams;

describe("getConfig()", () => {
  it("returns contract configuration", async () => {
    const result = getConfig(mockParams);

    expect(result).toStrictEqual({
      abi: abis.batchAuctionHouse,
      address: mockAddress,
      functionName: "refundBid",
      args: [
        BigInt(mockParams.lotId),
        BigInt(mockParams.bidId),
        BigInt(mockParams.bidIndex),
      ],
    } satisfies RefundBidConfig);
  });

  it("throws an error if invalid params are supplied", async () => {
    const invalidParams = { ...mockParams, lotId: "invalid" };

    expect(() =>
      getConfig(
        // @ts-expect-error - deliberately testing invalid params
        invalidParams,
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `[OriginSdkError: Invalid parameters supplied to getConfig()]`,
    );
  });
});
