import { describe, expect, it } from "vitest";
import { getConfig } from "./get-config";
import { zeroAddress } from "viem";
import { SetMerkleRootParams } from "./types";
import { abis } from "@axis-finance/abis";

const mockAllowlist = [
  ["0x0000000000000000000000000000000000000004", "5000000000000000000"],
  ["0x0000000000000000000000000000000000000020", "0"],
  ["0x0000000000000000000000000000000000000021", "50"],
  ["0x0000000000000000000000000000000000000022", "60"],
];

const mockMerkleRootResult =
  "0xae177673a8db8795a6e8287bbfe67c9425307898c97394d8c87dae3ecf0c5e3c";

const mockAddress = zeroAddress;
const lotId = 1;

const mockParams = {
  lotId,
  callback: mockAddress,
  allowlist: {
    types: ["address", "uint256"],
    values: mockAllowlist,
  },
} satisfies SetMerkleRootParams;

describe("getSetMerkleRootParams()", () => {
  it("returns the contract configuration", () => {
    const result = getConfig(mockParams);

    expect(result).toStrictEqual({
      abi: abis.merkleAllowlist,
      address: mockAddress,
      functionName: "setMerkleRoot",
      args: [BigInt(lotId), mockMerkleRootResult],
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
