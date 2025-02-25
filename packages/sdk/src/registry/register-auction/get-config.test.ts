import { describe, it, expect } from "vitest";
import { zeroAddress } from "viem";
import { abis } from "@axis-finance/abis";
import { getConfig } from "./get-config";
import type { RegisterAuctionParams } from "./types";
import { deployments } from "@axis-finance/deployments";
import { base, baseSepolia } from "viem/chains";

const mockAddress = zeroAddress;

const mockParams = {
  lotId: 1,
  ipfsCID: "bafkreibrg54iagxurhyqh7g6avbzuzhyzslex25korapzcjjwb57i6fpxi",
  auctionHouse: mockAddress,
  isTestnet: false,
} satisfies RegisterAuctionParams;

describe("getConfig()", () => {
  it("returns contract configuration for mainnet", async () => {
    const registryAddress = deployments[base.id].registry;
    const result = getConfig(mockParams);

    expect(result).toStrictEqual({
      chainId: base.id,
      abi: abis.axisMetadataRegistry,
      address: registryAddress,
      functionName: "registerAuction",
      args: [mockAddress, BigInt(mockParams.lotId), mockParams.ipfsCID],
    });
  });

  it("returns contract configuration for testnet", async () => {
    const registryAddress = deployments[baseSepolia.id].registry;
    const result = getConfig({ ...mockParams, isTestnet: true });

    expect(result).toStrictEqual({
      chainId: baseSepolia.id,
      abi: abis.axisMetadataRegistry,
      address: registryAddress,
      functionName: "registerAuction",
      args: [mockAddress, BigInt(mockParams.lotId), mockParams.ipfsCID],
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
