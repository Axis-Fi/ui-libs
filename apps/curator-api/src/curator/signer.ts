import * as dotenv from "dotenv";
import {
  createPublicClient,
  createWalletClient,
  http,
  type HttpTransport,
  type PrivateKeyAccount,
  type Address,
  type WalletClient,
  type PublicClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { registry } from "./env";

dotenv.config();

if (process.env.SIGNER_KEY == null) {
  throw Error("process.env.SIGNER_KEY is not set");
}

const signerKey = process.env.SIGNER_KEY! as Address;

const walletClient: WalletClient<
  HttpTransport,
  typeof registry.chain,
  PrivateKeyAccount
> = createWalletClient({
  account: privateKeyToAccount(signerKey),
  transport: http(),
  chain: registry.chain,
});

const publicClient: PublicClient<HttpTransport, typeof registry.chain> =
  createPublicClient({
    chain: registry.chain,
    transport: http(),
  });

export { walletClient, publicClient };
