export enum CallbacksType {
  NONE = "None",
  CUSTOM = "Custom",
  MERKLE_ALLOWLIST = "MerkleAllowlist",
  CAPPED_MERKLE_ALLOWLIST = "CappedMerkleAllowlist",
  ALLOCATED_MERKLE_ALLOWLIST = "AllocatedMerkleAllowlist",
  TOKEN_ALLOWLIST = "TokenAllowlist",
  UNIV2_DTL = "UniswapV2DirectToLiquidity",
  UNIV3_DTL = "UniswapV3DirectToLiquidity",
  BASELINE = "Baseline",
  BASELINE_ALLOWLIST = "BaselineAllowlist",
  BASELINE_ALLOCATED_ALLOWLIST = "BaselineAllocatedAllowlist",
  BASELINE_CAPPED_ALLOWLIST = "BaselineCappedAllowlist",
  BASELINE_TOKEN_ALLOWLIST = "BaselineTokenAllowlist",
}

export const isBaselineCallback = (callbacksType?: string) => {
  return (
    callbacksType === CallbacksType.BASELINE ||
    callbacksType === CallbacksType.BASELINE_ALLOWLIST ||
    callbacksType === CallbacksType.BASELINE_ALLOCATED_ALLOWLIST ||
    callbacksType === CallbacksType.BASELINE_CAPPED_ALLOWLIST ||
    callbacksType === CallbacksType.BASELINE_TOKEN_ALLOWLIST
  );
};
