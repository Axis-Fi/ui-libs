import {
  request,
  GetBatchAuctionLotDocument,
  GetBatchAuctionLotQuery,
} from "@axis-finance/subgraph-client";

type GetAuctionLotParams = {
  endpoint: string;
  lotId: number;
};

export const getAuctionLot = (params: GetAuctionLotParams) => {
  return request<GetBatchAuctionLotQuery>(
    params.endpoint,
    GetBatchAuctionLotDocument,
    {
      id: params.lotId,
    },
  );
};
