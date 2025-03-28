import createTsupConfig from "@axis-finance/tsup-config";

export default createTsupConfig({
  dts: false, // we use tsc to generate *.d.ts types as tsup fails to
  entry: {
    index: "src/index.ts",
    "react/index": "src/react/index.ts",
  },
  // don't bundle peerDependencies
  external: [
    "@tanstack/react-query",
    "react",
    "viem",
    "wagmi",
    "use-sync-external-store",
  ],
});
