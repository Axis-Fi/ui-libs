import type { Abi } from "abitype";
import batchCatalogue from "./BatchCatalogue.json";
import _batchAuctionHouse from "./BatchAuctionHouse.json";
import encryptedMarginalPrice from "./EncryptedMarginalPrice.json";
import fixedPriceBatch from "./FixedPriceBatch.json";
import linearVesting from "./LinearVesting.json";
import testnetERC20 from "./TestnetERC20.json";
import merkleAllowlist from "./MerkleAllowlist.json";
import cappedMerkleAllowlist from "./CappedMerkleAllowlist.json";
import tokenAllowlist from "./TokenAllowlist.json";
import allocatedMerkleAllowlist from "./AllocatedMerkleAllowlist.json";
import uniV2Dtl from "./UniswapV2DirectToLiquidity.json";
import uniV3Dtl from "./UniswapV3DirectToLiquidity.json";
import uniV2Factory from "./IUniswapV2Factory.json";
import uniV3Factory from "./IUniswapV3Factory.json";
import uniV3Pool from "./UniswapV3Pool.json";
import baseline from "./Baseline.json";
import baselineAllowlist from "./BaselineAllowlist.json";
import baselineAllocatedAllowlist from "./BaselineAllocatedAllowlist.json";
import baselineCappedAllowlist from "./BaselineCappedAllowlist.json";
import baselineTokenAllowlist from "./BaselineTokenAllowlist.json";
import bpool from "./BPOOL.json";
import axisMetadataRegistry from "./AxisMetadataRegistry.json";

const uniswapV3DtlWithAllocatedMerkleAllowlist = uniV3Dtl;

type ContractAbi = { abi: Abi };
type ContractAbis = {
  batchCatalogue: ContractAbi;
  batchAuctionHouse: ContractAbi;
  encryptedMarginalPrice: ContractAbi;
  fixedPriceBatch: ContractAbi;
  linearVesting: ContractAbi;
  merkleAllowlist: ContractAbi;
  cappedMerkleAllowlist: ContractAbi;
  tokenAllowlist: ContractAbi;
  allocatedMerkleAllowlist: ContractAbi;
  uniV2Dtl: ContractAbi;
  uniV3Dtl: ContractAbi;
  uniV2Factory: ContractAbi;
  uniV3Factory: ContractAbi;
  uniV3Pool: ContractAbi;
  baseline: ContractAbi;
  baselineAllowlist: ContractAbi;
  baselineAllocatedAllowlist: ContractAbi;
  baselineCappedAllowlist: ContractAbi;
  baselineTokenAllowlist: ContractAbi;
  bpool: ContractAbi;
  uniswapV3DtlWithAllocatedMerkleAllowlist: ContractAbi;
  axisMetadataRegistry: ContractAbi;
};

//Fetch errors from modules to include in the AuctionHouse ABI
const errors = [
  encryptedMarginalPrice.abi,
  fixedPriceBatch.abi,
  linearVesting.abi,
].flatMap((e) => e.filter((e) => e.type === "error"));

//Merge errors
const batchAuctionHouse = {
  abi: [..._batchAuctionHouse.abi, ...errors],
} as const;

export { testnetERC20 };

const abis = {
  batchCatalogue,
  batchAuctionHouse,
  encryptedMarginalPrice,
  fixedPriceBatch,
  linearVesting,
  merkleAllowlist,
  cappedMerkleAllowlist,
  tokenAllowlist,
  allocatedMerkleAllowlist,
  uniV2Dtl,
  uniV3Dtl,
  uniV2Factory,
  uniV3Factory,
  uniV3Pool,
  baseline,
  baselineAllowlist,
  baselineAllocatedAllowlist,
  baselineCappedAllowlist,
  baselineTokenAllowlist,
  bpool,
  uniswapV3DtlWithAllocatedMerkleAllowlist,
  axisMetadataRegistry,
} as ContractAbis;

export default abis;
