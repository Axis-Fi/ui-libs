import { describe, expect, it } from "vitest";
import { generateMerkleRoot } from "./generate-merkle-root";

const ALLOWLIST = [
  ["0x0000000000000000000000000000000000000004"],
  ["0x0000000000000000000000000000000000000020"],
  ["0x0000000000000000000000000000000000000021"],
  ["0x0000000000000000000000000000000000000022"],
];

const ALLOCATED_ALLOWLIST = [
  ["0x0000000000000000000000000000000000000004", "5000000000000000000"],
  ["0x0000000000000000000000000000000000000020", "0"],
  ["0x0000000000000000000000000000000000000021", "50"],
  ["0x0000000000000000000000000000000000000022", "60"],
];

const MISSING_AMOUNT_ALLOCATED_ALLOWLIST = [
  ["0x0000000000000000000000000000000000000004"],
  ["0x0000000000000000000000000000000000000020", "0"],
  ["0x0000000000000000000000000000000000000021", "50"],
  ["0x0000000000000000000000000000000000000022", "60"],
];

const INVALID_ADDRESS_ALLOWLIST = [
  ["0x0000000000000000000000000000000000000004"],
  ["0x00000000000000000000000000000000000"],
  ["0x00000000000000000000000000000000000000"],
];

const INVALID_AMOUNT_ALLOCATED_ALLOWLIST = [
  ["0x0000000000000000000000000000000000000004", "0.111"],
  ["0x0000000000000000000000000000000000000020", "0"],
  ["0x0000000000000000000000000000000000000021", "50"],
  ["0x0000000000000000000000000000000000000022", "60"],
];

const ALLOWLIST_MERKLE_ROOT =
  "0x856a7b35f9a773537006933f7a38f6468102d66214f0ed3f41a16620ee35373d";
const ALLOCATED_MERKLE_ROOT =
  "0xae177673a8db8795a6e8287bbfe67c9425307898c97394d8c87dae3ecf0c5e3c";

const BASE_ERROR = "Failed to generate Merkle Tree Root due to:\n";

describe("getSetMerkleRootParams()", () => {
  it("generates a merkle tree root for an allowlist", () => {
    const result = generateMerkleRoot({
      types: ["address"],
      values: ALLOWLIST,
    });

    expect(result).toEqual(ALLOWLIST_MERKLE_ROOT);
  });

  it("generates a merkle tree root for an allocated allowlist", () => {
    const result = generateMerkleRoot({
      types: ["address", "uint256"],
      values: ALLOCATED_ALLOWLIST,
    });

    expect(result).toEqual(ALLOCATED_MERKLE_ROOT);
  });

  it("throws an error on invalid allowlist", () => {
    expect(() =>
      generateMerkleRoot({
        types: ["address", "uint256"],
        values: MISSING_AMOUNT_ALLOCATED_ALLOWLIST,
      }),
    ).toThrow(`${BASE_ERROR}Missing address or amount on line(s) 1`);
  });

  it("throws an error on invalid addresses", () => {
    expect(() =>
      generateMerkleRoot({
        types: ["address"],
        values: INVALID_ADDRESS_ALLOWLIST,
      }),
    ).toThrow(`${BASE_ERROR}Invalid address on line(s) 2, 3`);
  });

  it("throws an error on invalid amounts", () => {
    expect(() =>
      generateMerkleRoot({
        types: ["address", "uint256"],
        values: INVALID_AMOUNT_ALLOCATED_ALLOWLIST,
      }),
    ).toThrow(`${BASE_ERROR}Invalid amount on line(s) 1`);
  });

  it("throws composed errors", () => {
    expect(() =>
      generateMerkleRoot({
        types: ["address", "uint256"],
        values: [
          ...INVALID_AMOUNT_ALLOCATED_ALLOWLIST,
          ...MISSING_AMOUNT_ALLOCATED_ALLOWLIST,
        ],
      }),
    ).toThrow(
      `${BASE_ERROR}Missing address or amount on line(s) 5\nInvalid amount on line(s) 1`,
    );
  });
});
