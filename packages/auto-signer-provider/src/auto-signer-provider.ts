import {
  createTestClient,
  http,
  walletActions,
  TestRpcSchema,
  PublicRpcSchema,
  WalletRpcSchema,
  publicActions,
  type Chain,
  type Hex,
  type Address,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";

export type AutoSignerProviderOptions = {
  rpcUrl: string;
  chain: Chain;
  privateKey: Hex;
  debug?: boolean;
};

type TransactionParams = {
  from?: Address;
  to: Address;
  value?: string;
  data?: Hex;
  gas?: string;
  gasPrice?: string;
};

type RpcMethod = (
  | PublicRpcSchema[number]
  | TestRpcSchema<"anvil">[number]
  | WalletRpcSchema[number]
)["Method"];

type EthereumProvider = {
  chainId: Hex;
  isMetaMask: boolean;
  selectedAddress: Address;
  events: Record<string, ((...args: unknown[]) => void)[]>;
  request: (request: {
    method: RpcMethod;
    params: TransactionParams[];
  }) => Promise<unknown>;
  on: (
    event: string,
    handler: (...args: unknown[]) => void,
  ) => EthereumProvider;
  removeListener: (
    event: string,
    handler: (...args: unknown[]) => void,
  ) => EthereumProvider;
  emit: (event: string, ...args: unknown[]) => void;
};

/**
 * Auto-signs transactions using the provided private key.
 * Skips browser wallet interactions.
 * Useful for automated testing.
 * @param options
 * @returns EthereumProvider
 */
const autoSignerProvider = (
  options: AutoSignerProviderOptions,
): EthereumProvider => {
  const { rpcUrl, chain, privateKey, debug } = options;

  const account = privateKeyToAccount(privateKey);

  const testClient = createTestClient({
    chain: chain,
    mode: "anvil",
    account,
    transport: http(rpcUrl),
  })
    .extend(publicActions)
    .extend(walletActions);

  return {
    isMetaMask: true,
    selectedAddress: account.address,
    chainId: `0x${chain.id.toString(16)}`,
    events: {},

    on(event: string, handler: (...args: unknown[]) => void) {
      if (!this.events[event]) this.events[event] = [];
      this.events[event].push(handler);
      return this;
    },

    removeListener(event: string, handler: (...args: unknown[]) => void) {
      if (this.events[event]) {
        this.events[event] = this.events[event].filter((h) => h !== handler);
      }
      return this;
    },

    emit(event: string, ...args: unknown[]) {
      if (this.events[event]) {
        this.events[event].forEach((handler) => handler(...args));
      }
    },

    async request({
      method,
      params,
    }: {
      method: RpcMethod;
      params: TransactionParams[];
    }): Promise<unknown> {
      try {
        debug && console.log(`AutoSignerProvider: Method: ${method}`, params);

        switch (method) {
          case "eth_chainId":
            return this.chainId;
          case "eth_accounts":
          case "eth_requestAccounts":
            return [account.address];
          case "eth_sendTransaction": {
            const tx = params[0];
            return await testClient.sendTransaction({
              from: account.address,
              to: tx.to,
              value: tx.value ? BigInt(tx.value) : undefined,
              data: tx.data,
            });
          }
          default: {
            return await testClient.request({
              // @ts-expect-error type doesn't need to be as specific as the method wants
              method,
              params,
            });
          }
        }
      } catch (e) {
        console.error(`AutoSignerProvider: ${method} error:`, e);
        throw e;
      }
    },
  };
};

export { autoSignerProvider };
