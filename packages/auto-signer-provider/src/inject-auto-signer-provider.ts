import {
  autoSignerProvider,
  type AutoSignerProviderOptions,
} from "./auto-signer-provider";

const injectAutoSignerProvider = ({
  rpcUrl,
  chain,
  privateKey,
}: AutoSignerProviderOptions) => {
  if (typeof window === "undefined") return;
  // @ts-expect-error - todo: add window type
  window.ethereum = autoSignerProvider({ rpcUrl, chain, privateKey });
};

export { injectAutoSignerProvider };
