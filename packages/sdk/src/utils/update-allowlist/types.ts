import { SetMerkleRootConfig, SetMerkleRootParams } from "../../periphery";
import { RegisterAuctionConfig, RegisterAuctionParams } from "../../registry";
import { SaveParams } from "../metadata-client";

export type UpdateAllowlistParams = Omit<
  RegisterAuctionParams & SetMerkleRootParams & SaveParams,
  "ipfsCID" | "metadata" | "id"
> & { chainId: number };

export type UpdateAllowlistResult = {
  registerAuctionConfig: RegisterAuctionConfig;
  setMerkleRootConfig: SetMerkleRootConfig;
};
