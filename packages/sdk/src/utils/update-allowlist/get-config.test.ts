import { describe, it, expect, vi } from "vitest";
import { getConfig } from "./get-config";
import { zeroAddress } from "viem";
import { MetadataClient } from "../metadata-client";
import { abis } from "@axis-finance/abis";
import { deployments } from "@axis-finance/deployments";
import { base } from "viem/chains";
import { UpdateAllowlistParams } from "./types";

const mockAllowlist = [
  ["0x0000000000000000000000000000000000000004", "5000000000000000000"],
  ["0x0000000000000000000000000000000000000020", "0"],
  ["0x0000000000000000000000000000000000000021", "50"],
  ["0x0000000000000000000000000000000000000022", "60"],
];

const mockMerkleRootResult =
  "0xae177673a8db8795a6e8287bbfe67c9425307898c97394d8c87dae3ecf0c5e3c";
const mockCID = "bafkreihv223uekzoo24w3zxkzjj25yenpvr5xfc6jychur5wjhy4rhnme4";

const mockAddress = zeroAddress;
const lotId = 1;

const registryAddress = deployments[base.id].registry;

const mockParams = {
  lotId,
  allowlist: {
    types: ["address", "uint256"],
    values: mockAllowlist,
  },
  auctionHouse: mockAddress,
  chainId: base.id,
} satisfies UpdateAllowlistParams;

const mockAuction = {
  batchAuctionLot: {
    callbacks: mockAddress,
    info: {
      id: "auction-12341234",
    },
  },
};
vi.mock("../get-auction-lot.ts", () => {
  return {
    getAuctionLot: vi.fn(() => mockAuction),
  };
});

describe("getConfig()", () => {
  it("returns contract configuration", async () => {
    const metadataClient = new MetadataClient({
      fleekApplicationClientId: "1337",
    });

    vi.spyOn(metadataClient, "save").mockResolvedValue(mockCID);

    const result = await getConfig(mockParams, metadataClient);

    expect(result.registerAuctionConfig).toStrictEqual({
      chainId: base.id,
      abi: abis.axisMetadataRegistry,
      address: registryAddress,
      functionName: "registerAuction",
      args: [mockAddress, BigInt(mockParams.lotId), mockCID],
    });

    expect(result.setMerkleRootConfig).toStrictEqual({
      abi: abis.merkleAllowlist,
      address: zeroAddress,
      functionName: "setMerkleRoot",
      args: [BigInt(mockParams.lotId), mockMerkleRootResult],
    });
  });

  it("throws an error if invalid params are supplied", async () => {
    const invalidParams = { ...mockParams, lotId: "invalid" };
    const metadataClient = new MetadataClient({
      fleekApplicationClientId: "1337",
    });

    const result = getConfig(
      // @ts-expect-error - deliberately testing invalid params
      invalidParams,
      metadataClient,
    );

    expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
      `[OriginSdkError: Invalid parameters supplied to getConfig()]`,
    );
  });
});
