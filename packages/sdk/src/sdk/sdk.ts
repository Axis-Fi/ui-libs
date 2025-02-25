import {
  type CloakClient,
  createCloakClient,
  Configuration,
} from "@axis-finance/cloak";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { type AxisDeployments, deployments } from "@axis-finance/deployments";
import {
  Environment,
  getCloakServer,
  getCuratorServer,
} from "@axis-finance/env";
import * as core from "../core";
import * as periphery from "../periphery";
import * as registry from "../registry";
import {
  MetadataClient,
  type CuratorClient,
  type CuratorRouter,
  type OriginConfig,
} from "../types";
import type {
  Core,
  BidParams,
  BidConfig,
  ClaimBidsParams,
  ClaimBidsConfig,
  RefundBidParams,
  RefundBidConfig,
  SettleParams,
  SettleConfig,
  AbortParams,
  AbortConfig,
  GetTokenPriceParams,
  CancelConfig,
  CancelParams,
  CreateConfig,
  CreateParams,
} from "../core";
import type {
  Periphery,
  SetMerkleRootConfig,
  SetMerkleRootParams,
} from "../periphery";
import { SaveParams } from "../utils/metadata-client";
import type {
  Registry,
  RegisterAuctionParams,
  RegisterAuctionConfig,
} from "../registry";

const defaultConfig: OriginConfig = {
  environment: Environment.PRODUCTION,
  cloak: {
    url: getCloakServer(Environment.PRODUCTION).url,
  },
  curator: {
    url: getCuratorServer(Environment.PRODUCTION).url,
  },
};

/**
 * OriginSdk provides convenience helpers for interacting with Axis Origin protocol.
 *
 * @example
 * import { OriginSdk } from "@axis-fi/sdk";
 *
 * const sdk = new OriginSdk({
 *   cloak: {
 *     url: "https://cloak.example.com/api"
 *   }
 * })
 */
class OriginSdk {
  config: OriginConfig;
  core: Core;
  periphery: Periphery;
  registry: Registry;
  deployments: AxisDeployments;
  cloakClient: CloakClient;
  metadataClient?: MetadataClient;
  curatorClient: CuratorClient;

  constructor(
    _config: OriginConfig = defaultConfig,
    _core: Core = core,
    _periphery: Periphery = periphery,
    _registry: Registry = registry,
    _deployments: AxisDeployments = deployments,
  ) {
    this.config = _config;
    this.core = _core;
    this.deployments = _deployments;
    this.periphery = _periphery;
    this.registry = _registry;

    this.cloakClient = createCloakClient(
      new Configuration({ basePath: _config.cloak.url }),
    );

    this.curatorClient = createTRPCProxyClient<CuratorRouter>({
      links: [
        httpBatchLink({
          url: _config.curator.url,
        }),
      ],
    });

    this.metadataClient = _config.metadata?.fleekApplicationClientId
      ? new MetadataClient({
          fleekApplicationClientId: _config.metadata?.fleekApplicationClientId,
        })
      : undefined;
  }

  async getTokenPrice(params: GetTokenPriceParams): Promise<number> {
    return this.core.tokens.functions.getTokenPrice(
      params.token,
      params.timestamp,
    );
  }

  isUsdToken(symbol: string): boolean {
    return this.core.tokens.functions.isUsdToken(symbol);
  }

  /**
   * Gets the contract config required to execute a bid transaction on the auction house smart contract from unprimed parameters.
   *
   * @side_effects
   * - Encrypts the bid via the cloak service
   *
   * @todo
   * - Add cloak service repo link in side effect text above
   *
   * @param params - Unprimed bid parameters
   * @returns Contract config for the bid transaction
   *
   * @example
   * import { sdk } from "./sdk"
   *
   * try {
   *   const config = await sdk.bid({
   *     lotId: 1,
   *     chainId: 1,
   *     amountIn: 100,
   *     amountOut: 100,
   *     auctionType: AuctionType.SEALED_BID,
   *     bidderAddress: "0x123...",
   *     referrerAddress: "0x456...",
   *     signedPermit2Approval: "0x789...",
   *   })
   * } catch (error: SdkError) {
   *   console.log(error.message, error.issues)
   * }
   */
  async bid(params: BidParams): Promise<BidConfig> {
    return this.core.bid.getConfig(params, this.cloakClient);
  }

  /**
   * Gets the contract config required to execute a claimBids transaction on the auction house smart contract.
   *
   * @param params claimBids parameters
   * @returns Contract config for the claimBids transaction
   *
   * @example
   * import { sdk } from "./sdk"
   *
   * try {
   *   const config = sdk.claimBids({
   *     lotId: 1,
   *     bids: [1, 2, 3],
   *     chainId: 1,
   *   })
   * } catch (error: SdkError) {
   *   console.log(error.message, error.issues)
   * }
   */
  claimBids(params: ClaimBidsParams): ClaimBidsConfig {
    return this.core.claimBids.getConfig(params);
  }

  /**
   * Gets the contract config required to execute a refundBid transaction on the auction house smart contract.
   *
   * @param params refundBid parameters
   * @returns Contract config for the refundBid transaction
   *
   * @example
   * import { sdk } from "./sdk"
   *
   * try {
   *   const config = sdk.refundBid({
   *     lotId: 1,
   *     bidId: 10,
   *     bidIndex: 1,
   *     chainId: 1,
   *   })
   * } catch (error: SdkError) {
   *   console.log(error.message, error.issues)
   * }
   */
  refundBid(params: RefundBidParams): RefundBidConfig {
    return this.core.refundBid.getConfig(params);
  }

  /**
   * Gets the contract config required to execute a settle transaction on the auction house smart contract.
   *
   * @param params settle parameters
   * @returns Contract config for the settle transaction
   *
   * @example
   * import { sdk } from "./sdk"
   *
   * try {
   *   const config = sdk.settle({
   *     lotId: 1,
   *     chainId: 1,
   *     numBids: 10,
   *     callbackData: "0x...",
   *   })
   * } catch (error: SdkError) {
   *   console.log(error.message, error.issues)
   * }
   */
  settle(params: SettleParams): SettleConfig {
    return this.core.settle.getConfig(params);
  }

  /**
   * Gets the contract config required to execute an abort transaction on the auction house smart contract.
   * Aborting an auction ends it and enables bidders to reclaim their bids.
   *
   * @param params abort parameters
   * @returns Contract config for the abort transaction
   *
   * @example
   * import { sdk } from "./sdk"
   *
   * try {
   *   const config = sdk.abort({
   *     lotId: 1,
   *     chainId: 1,
   *   })
   * } catch (error: SdkError) {
   *   console.log(error.message, error.issues)
   * }
   */
  abort(params: AbortParams): AbortConfig {
    return this.core.abort.getConfig(params);
  }

  /**
   * Gets the contract config required to execute a cancel transaction on the auction house smart contract.
   * Cancelling an auction ends the auction, and is only possible before a bidder has bid on it.
   *
   * @param params cancel parameters
   * @returns Contract config for the cancel transaction
   *
   * @example
   * import { sdk } from "./sdk"
   *
   * try {
   *   const config = sdk.cancel({
   *     lotId: 1,
   *     chainId: 1,
   *   })
   * } catch (error: SdkError) {
   *   console.log(error.message, error.issues)
   * }
   */
  cancel(params: CancelParams): CancelConfig {
    return this.core.cancel.getConfig(params);
  }

  /**
   * // TODO
   * todo
   *
   * @param params create parameters
   * @returns Contract config for the create transaction
   *
   * @example
   * import { sdk } from "./sdk"
   *
   * try {
   *   const config = await sdk.create({
   *     //TODO: 1,
   *   })
   * } catch (error: SdkError) {
   *   console.log(error.message, error.issues)
   * }
   */
  async create(params: CreateParams): Promise<CreateConfig> {
    return this.core.create.getConfig(params, this.metadataClient);
  }

  setMerkleRoot(params: SetMerkleRootParams): SetMerkleRootConfig {
    return this.periphery.callbacks.setMerkleRoot.getConfig(params);
  }

  async saveMetadata(params: SaveParams): Promise<string | undefined> {
    return this.metadataClient?.save(params);
  }

  registerAuction(params: RegisterAuctionParams): RegisterAuctionConfig {
    return this.registry.registerAuction.getConfig(params);
  }
}

const createSdk = (config?: OriginConfig) => new OriginSdk(config);

export { OriginSdk, createSdk };

export type * from "../core";
