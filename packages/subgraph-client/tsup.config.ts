import createConfig from "@axis-finance/tsup-config";

export default createConfig({
  entry: {
    index: "src/index.ts",
    request: "src/request.ts",
  },
  // don't bundle peerDependencies
  external: ["@tanstack/react-query", "react", "use-sync-external-store"],
});
