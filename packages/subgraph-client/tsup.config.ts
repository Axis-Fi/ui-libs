import createConfig from "@axis-finance/tsup-config";

export default createConfig({
  entry: {
    index: "src/index.ts",
    request: "src/request.ts",
  },
});
