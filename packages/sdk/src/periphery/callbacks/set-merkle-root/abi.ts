export const abi = [
  {
    name: "setMerkelRootParams",
    type: "tuple",
    components: [
      {
        name: "lotId",
        type: "uint96",
      },
      {
        name: "merkleRoot",
        type: "bytes32",
      },
    ],
  },
] as const;
