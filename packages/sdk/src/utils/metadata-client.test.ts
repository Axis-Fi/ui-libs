import { describe, it, expect, vi } from "vitest";
import { createMetadataClient } from "./metadata-client";
import { FleekSdk } from "@fleek-platform/sdk/browser";

vi.mock("@fleek-platform/sdk/browser", () => ({
  FleekSdk: vi.fn(() => ({
    storage: () => ({
      uploadFile: vi.fn().mockResolvedValue({ pin: { cid: "mock-cid" } }),
    }),
  })),
  ApplicationAccessTokenService: vi.fn(),
}));

describe("createMetadataClient()", () => {
  const validConfig = {
    fleekApplicationClientId: "test-client-id",
  };

  const validSaveParams = {
    metadata: `{"test": "mock-data"}`,
    id: "mock-id",
  };

  it("creates a client with the expected configuration", () => {
    const client = createMetadataClient(validConfig);
    expect(client).toBeDefined();
    expect(client.save).toBeInstanceOf(Function);
  });

  it("throws an error when fleekApplicationClientId is not supplied", () => {
    // @ts-expect-error deliberately calling with empty object
    expect(() => createMetadataClient({})).toThrowErrorMatchingInlineSnapshot(
      `[Error: Fleek application client ID is required]`,
    );
  });

  it("throws an error when config is not supplied", () => {
    // @ts-expect-error deliberately calling with no args
    expect(() => createMetadataClient()).toThrowErrorMatchingInlineSnapshot(
      `[TypeError: Cannot destructure property 'fleekApplicationClientId' of 'undefined' as it is undefined.]`,
    );
  });

  describe("save()", () => {
    const client = createMetadataClient(validConfig);

    it("saves valid JSON metadata and returns expected cid", async () => {
      const cid = await client.save(validSaveParams);
      expect(cid).toBe("mock-cid");
    });

    it("throws error for invalid JSON metadata", async () => {
      await expect(
        // @ts-expect-error deliberately testing invalid params
        client.save("invalid json"),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `[Error: Invalid JSON metadata]`,
      );
    });

    it("throws error when upload fails", async () => {
      vi.mocked(FleekSdk).mockImplementationOnce(() => ({
        // @ts-expect-error partial implementation for test
        storage: () => ({
          uploadFile: vi.fn().mockRejectedValue(new Error("Upload failed")),
        }),
      }));

      const failClient = createMetadataClient(validConfig);
      await expect(
        failClient.save(validSaveParams),
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `[Error: Failed to store metadata: Error: Upload failed]`,
      );
    });
  });
});
