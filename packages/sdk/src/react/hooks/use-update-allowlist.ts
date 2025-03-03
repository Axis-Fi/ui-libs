import { useQuery } from "@tanstack/react-query";
import { UpdateAllowlistParams } from "../../utils/update-allowlist";
import { useSdk } from "./use-sdk";
import {
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
  UseWaitForTransactionReceiptReturnType,
} from "wagmi";

type UseUpdateAllowlistResult = {
  submitRegisterAuction: () => void;
  isWaitingForRegisterAuction: boolean;
  registerAuctionReceipt: UseWaitForTransactionReceiptReturnType;
  registerAuctionError: Error | null;

  submitMerkleRootTx: () => void;
  isWaitingForMerkleRoot: boolean;
  merkleRootReceipt: UseWaitForTransactionReceiptReturnType;
  merkleRootError: Error | null;
};

/**
 * Updates an allowlist by saving it to a metadata server (defaulting to IPFS),
 * updating the IPFS CID on the subgraph, and calculating and submitting the allowlist Merkle root.
 *
 * @param {UpdateAllowlistParams} params - Parameters for updating the allowlist
 * @returns {Object} - The hook's return values and functions.
 * @returns {Function} return.submitRegisterAuction - Submits the register auction transaction.
 * @returns {boolean} return.isWaitingForRegisterAuction - Indicates if the register auction transaction is pending.
 * @returns {Object} return.registerAuctionReceipt - Transaction receipt for the register auction.
 * @returns {Error | null} return.registerAuctionError - Any error that occurred during the register auction process.
 *
 * @returns {Function} return.submitMerkleRootTx - Submits the Merkle root transaction.
 * @returns {boolean} return.isWaitingForMerkleRoot - Indicates if the Merkle root transaction is pending.
 * @returns {Object} return.merkleRootReceipt - Transaction receipt for setting the Merkle root.
 * @returns {Error | null} return.merkleRootError - Any error that occurred during the Merkle root process.
 */
export function useUpdateAllowlist(
  params: UpdateAllowlistParams,
): UseUpdateAllowlistResult {
  const sdk = useSdk();

  const config = useQuery({
    queryFn: async () => sdk.updateAllowlist(params),
    queryKey: ["update-allowlist", params.lotId, params.chainId],
  });

  const merkleRootSim = useSimulateContract({
    ...config.data?.setMerkleRootConfig,
    query: {
      enabled: config.isSuccess,
    },
  });

  const registerAuctionSim = useSimulateContract({
    ...config.data?.registerAuctionConfig,
    query: {
      enabled: config.isSuccess,
    },
  });

  const registerAuctionTx = useWriteContract();
  const merkleRootTx = useWriteContract();

  const submitRegisterAuction = () => {
    if (registerAuctionSim.data) {
      registerAuctionTx.writeContract(registerAuctionSim.data.request);
    }
  };

  const submitMerkleRootTx = () => {
    if (merkleRootSim.data) {
      merkleRootTx.writeContract(merkleRootSim.data.request);
    }
  };

  const registerAuctionReceipt = useWaitForTransactionReceipt({
    hash: registerAuctionTx.data,
  });

  const merkleRootReceipt = useWaitForTransactionReceipt({
    hash: merkleRootTx.data,
  });

  const isWaitingForRegisterAuction =
    registerAuctionTx.isPending || registerAuctionReceipt.isLoading;
  const isWaitingForMerkleRoot =
    merkleRootTx.isPending || merkleRootReceipt.isLoading;

  const registerAuctionError =
    registerAuctionSim.error ||
    registerAuctionTx.error ||
    registerAuctionTx.error;

  const merkleRootError =
    merkleRootSim.error || merkleRootTx.error || merkleRootReceipt.error;

  return {
    submitRegisterAuction,
    isWaitingForRegisterAuction,
    registerAuctionReceipt,
    registerAuctionError,

    submitMerkleRootTx,
    merkleRootError,
    merkleRootReceipt,
    isWaitingForMerkleRoot,
  };
}
