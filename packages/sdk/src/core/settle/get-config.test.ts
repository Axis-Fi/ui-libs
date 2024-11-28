import { describe, it, expect, vi } from "vitest";
import { zeroAddress } from "viem";
import { abis } from "@axis-finance/abis";
import { AuctionType } from "@axis-finance/types";
import { getConfig } from "./get-config";
import type { SettleParams } from "./types";

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
  numBids: 2,
  chainId: 1,
  auctionType: AuctionType.SEALED_BID,
  callbackData: mockAddress,
} satisfies SettleParams;

describe("getConfig()", () => {
  it("returns contract configuration", async () => {
    const result = getConfig(mockParams);

    expect(result).toStrictEqual({
      abi: abis.batchAuctionHouse,
      address: mockAddress,
      functionName: "settle",
      args: [
        BigInt(mockParams.lotId),
        BigInt(mockParams.numBids),
        mockParams.callbackData,
      ],
    });
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
