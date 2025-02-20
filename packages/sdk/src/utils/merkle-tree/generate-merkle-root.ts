import * as v from "valibot";
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { GenerateMerkleTreeParams } from "./types";
import { schema } from "./schema";
import { isAddress } from "viem";

/**
 * Generates a Merkle Tree Root for an allowlist file format
 * */
export const generateMerkleTreeRoot = (args: GenerateMerkleTreeParams) => {
  const { values, types } = v.parse(schema, args);

  validateAllowlistEntries(args);

  const { root } = StandardMerkleTree.of(values, types);

  return root;
};

/**
 * Validates allowlist structure, addresses, and amounts
 */
function validateAllowlistEntries({ values, types }: GenerateMerkleTreeParams) {
  const errors = {
    invalidEntry: [] as number[],
    invalidAddress: [] as number[],
    invalidAmount: [] as number[],
  };

  values.forEach((value, i) => {
    const lineNumber = i + 1;

    //Checks size mismatch
    if (types.length !== value.length) errors.invalidEntry.push(lineNumber);
    //Checks for invalid address
    if (!isAddress(value[0])) errors.invalidAddress.push(lineNumber);
    //Checks for invalid amounts
    if (value.length === 2 && !isValidBigInt(value[1]))
      errors.invalidAmount.push(lineNumber);
  });

  const errorMessage = joinErrors(errors);

  if (errorMessage) {
    throw new Error(
      `Failed to generate Merkle Tree Root due to:\n${errorMessage}`,
    );
  }
}

function isValidBigInt(value: string): boolean {
  try {
    BigInt(value);
    return true;
  } catch {
    return false;
  }
}

function joinErrors(errors: Record<string, number[]>): string {
  return Object.entries(errors)
    .filter(([, lines]) => lines.length > 0)
    .map(([key, lines]) => {
      const messages: Record<string, string> = {
        invalidEntry: "Missing address or amount",
        invalidAddress: "Invalid address",
        invalidAmount: "Invalid amount",
      };
      return `${messages[key]} on line(s) ${lines.join(", ")}\n`;
    })
    .join("");
}
