import { isTestnet, getMainnetTokenFromSymbol } from "@repo/deployments";
import type { Address, Token } from "@repo/types";
import { fetchTokenPrices } from "../utils";

const usdTokens = [
  "USDC",
  "USDT",
  "USDD",
  "TUSD",
  "PYUSD",
  "USDe",
  "USDP",
  "CRVUSD",
  "DAI",
  "USDB",
  "LUSD",
  "FRAX",
  "GUSD",
  "BUSD",
];
const isUsdToken = (symbol: string) => usdTokens.includes(symbol.toUpperCase());

const MAINNET_USDC = {
  chainId: 1,
  decimals: 6,
  symbol: "USDC",
  name: "USD Coin",
  address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" as Address,
};

const MAINNET_WETH = {
  chainId: 1,
  decimals: 18,
  symbol: "WETH",
  name: "Wrapped Ether",
  address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" as Address,
};

const MAINNET_MANTLE = {
  chainId: 1,
  decimals: 18,
  symbol: "MNT",
  name: "Mantle",
  address: "0x3c3a81e81dc49a522a592e7622a7e711c06bf354" as Address,
};

/**
 * If the token is a testnet token, stablecoin, or WETH: use the mainnet equivalent token instead.
 * This solves the problem where DeFiLlama doesn't support historical prices for certain chains (e.g. Blast)
 */
const adjustUnsupportedTokens = (tokens: Token[]): Token[] => {
  return tokens.map((token) => {
    if (isUsdToken(token.symbol)) {
      return MAINNET_USDC;
    }

    if (token.symbol === "WETH") {
      return MAINNET_WETH;
    }

    if (token.symbol === "WMNT") {
      return MAINNET_MANTLE;
    }

    if (isTestnet(token.chainId)) {
      return getMainnetTokenFromSymbol(token.symbol) || token;
    }

    return token;
  });
};

const getTokenPrices = async (
  tokens: Token[],
  timestamp: number | undefined,
): Promise<number[]> => {
  const adjustedTokens = adjustUnsupportedTokens(tokens);

  return fetchTokenPrices(adjustedTokens, timestamp);
};

const getTokenPrice = async (
  token: Token,
  timestamp: number | undefined,
): Promise<number> => {
  const [price] = await getTokenPrices([token], timestamp);
  return price;
};

export { getTokenPrice, getTokenPrices, isUsdToken };
