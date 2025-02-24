import { describe, it, expect, vi } from "vitest";
import { parseUnits } from "viem";
import { CloakClient } from "@axis-finance/cloak";
import * as cloakDep from "@axis-finance/cloak";
import { AuctionType } from "@axis-finance/types";
import { OriginSdk } from "./sdk";
import type { Core, BidParams } from "../core";
import type { OriginConfig } from "../types";
import { Environment } from "@axis-finance/env";

const mockConfig: OriginConfig = {
  environment: Environment.PRODUCTION,
  cloak: {
    url: "https://cloak.example.com/api",
  },
  curator: {
    url: "https://curator.example.com/api",
  },
  metadata: {
    fleekApplicationClientId: "mock_fleek_id",
  },
};

const mockCore = {
  bid: { getConfig: vi.fn() },
  claimBids: { getConfig: vi.fn() },
  refundBid: { getConfig: vi.fn() },
  auction: { functions: { getAuction: vi.fn() } },
} as unknown as Core;

const mockAddress = "0x1";
const mockTokenDecimals = 18;

describe("OriginSdk", () => {
  it("returns an OriginSdk instance with supplied params", () => {
    const sdk = new OriginSdk(mockConfig, mockCore);
    expect(sdk).toBeInstanceOf(OriginSdk);
    expect(sdk.config).toBe(mockConfig);
  });

  it("creates a cloak client", () => {
    const sdk = new OriginSdk(mockConfig, mockCore);
    expect(sdk.cloakClient).toBeInstanceOf(CloakClient);
  });

  it("creates a curator client", () => {
    const sdk = new OriginSdk(mockConfig, mockCore);
    expect(sdk.curatorClient).toBeDefined();
  });

  it("creates a metadata client", () => {
    const sdk = new OriginSdk(mockConfig, mockCore);
    expect(sdk.metadataClient).toBeDefined();
  });

  it("calls Configuration() with the supplied cloak config", () => {
    const mockConfigurationClass = class {
      constructor() {}
    } as unknown as cloakDep.Configuration;
    const configurationSpy = vi
      .spyOn(cloakDep, "Configuration")
      .mockReturnValue(mockConfigurationClass);

    new OriginSdk(mockConfig, mockCore);

    expect(configurationSpy).toHaveBeenCalledWith({
      basePath: mockConfig.cloak.url,
    });
  });

  it("calls createCloakClient() with the supplied cloak config", () => {
    const mockConfigurationClass = class {
      constructor() {}
    } as unknown as cloakDep.Configuration;

    vi.spyOn(cloakDep, "Configuration").mockReturnValue(mockConfigurationClass);

    const createCloakClientSpy = vi.spyOn(cloakDep, "createCloakClient");

    new OriginSdk(mockConfig, mockCore);

    expect(createCloakClientSpy).toHaveBeenCalledWith(mockConfigurationClass);
  });

  it("creates a cloak client", () => {
    const sdk = new OriginSdk(mockConfig);
    expect(sdk.cloakClient).toBeDefined();
  });
});

describe("OriginSdk: bid()", () => {
  it("calls bid module's getConfig() with the correct params", async () => {
    const mockParams = {
      lotId: 1,
      amountIn: parseUnits("100", mockTokenDecimals),
      amountOut: parseUnits("50", mockTokenDecimals),
      referrerAddress: mockAddress,
      auctionType: AuctionType.SEALED_BID,
      chainId: 1,
      bidderAddress: mockAddress,
      signedPermit2Approval: "0x",
      callbackData: "0x2",
    } satisfies BidParams;

    const sdk = new OriginSdk(mockConfig, mockCore);
    await sdk.bid(mockParams);

    expect(mockCore.bid.getConfig).toHaveBeenCalledWith(
      mockParams,
      sdk.cloakClient,
    );
  });
});

describe("OriginSdk: claimBids()", () => {
  it("calls claimBids module's getConfig() with the correct params", async () => {
    const mockParams = {
      lotId: 1,
      bids: [1, 2, 3],
      chainId: 1,
      auctionType: AuctionType.SEALED_BID,
    };

    const sdk = new OriginSdk(mockConfig, mockCore);
    sdk.claimBids(mockParams);

    expect(mockCore.claimBids.getConfig).toHaveBeenCalledWith(mockParams);
  });
});

describe("OriginSdk: refundBid()", () => {
  it("calls refundBid module's getConfig() with the correct params", async () => {
    const mockParams = {
      lotId: 1,
      bidId: 10,
      bidIndex: 10,
      chainId: 1,
      auctionType: AuctionType.SEALED_BID,
    };

    const sdk = new OriginSdk(mockConfig, mockCore);
    sdk.refundBid(mockParams);

    expect(mockCore.refundBid.getConfig).toHaveBeenCalledWith(mockParams);
  });
});
