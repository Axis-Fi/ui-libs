import { z } from "zod";
import { type Address } from "viem";
import type { Request, Response } from "express";
import { initTRPC, TRPCError } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { getCidForData, unpin } from "./fleek";
import { CuratorProfileSchema } from "./types";
import { walletClient } from "./curator/signer";
import { registry } from "./curator/env";
import { bustCache, getTwitterFollowing } from "./curator/axis-following";

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({ req, res });

type Context = {
  req: Request;
  res: Response;
};

const t = initTRPC.context<Context>().create();

const isTwitterVerified = t.middleware(({ ctx, next }) => {
  if (!ctx.req.isAuthenticated || !ctx.req.isAuthenticated()) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource.",
    });
  }

  return next();
});

const twitterVerifiedProcedure = t.procedure.use(isTwitterVerified);

export const appRouter = t.router({
  bustTwitterFollowingCache: t.procedure
    .input(z.object({ pwd: z.string() }))
    .query(({ input }) => bustCache(input.pwd)),
  twitterFollowing: t.procedure.input(z.void()).query(getTwitterFollowing),
  getSigningSignatureForCurator: twitterVerifiedProcedure
    .input(CuratorProfileSchema)
    .output(
      z.object({
        signature: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const curatorMetadataIpfsCid = input.ipfsCid;
      const curatorProfilePayload = input.curatorProfilePayload;
      const userTwitter = ctx.req.user?.username;
      const userTwitterId = BigInt(ctx.req.user?.id ?? 0);

      if (!userTwitter || userTwitterId === 0n) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Failed to get Twitter username/id from user.",
        });
      }

      // Two files with the same data generate the same CID when stored on IPFS.
      // To ensure a user submitted their true twitter username (in their submitted CID),
      // we generate a CID using their true Twitter session's username.
      // Note: Ideally we'd just read the CID data and check, but Fleek doesn't support
      // reading CID data, and public gateways are flaky (unreliable).

      // Step 1. Ensure twitter handle is in the expected places
      const checkPayload = curatorProfilePayload
        // Enforce the correct twitter link
        .replace(
          /"twitter":"(https:\/\/x\.com\/[^"]*)"/,
          `"twitter":"https://x.com/${userTwitter}"`,
        )
        // Enforce the correct twitter username
        .replace(
          /"twitter":"(?!https:\/\/)([^"]*)"/,
          `"twitter":"${userTwitter}"`,
        );

      const payloadContainsTwitterRecord = checkPayload.includes(
        `"twitter":"${userTwitter}`,
      );

      if (
        !payloadContainsTwitterRecord ||
        checkPayload !== curatorProfilePayload
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `User submitted curator profile payload doesn't contain their expected twitter handle`,
        });
      }

      // Step 2. Ensure they submitted an IPFS CID that matches their submitted data
      const checkIpfsCid = await getCidForData({
        key: userTwitter,
        data: checkPayload,
      });

      console.log("Check IPFS CID", checkIpfsCid);

      if (checkIpfsCid !== curatorMetadataIpfsCid) {
        try {
          await unpin(checkIpfsCid);
        } catch (e) {
          console.error("Error unpinning the comparison CID:", e);
        }

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `User submitted CID ${curatorMetadataIpfsCid} was different from the CID generated from their submitted data ${checkIpfsCid}`,
        });
      }

      console.log("Storing curator profile data:", input);

      const DOMAIN_TYPE = [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ] as const;

      const REGISTRATION_TYPE = [
        { name: "curator", type: "address" },
        { name: "xId", type: "uint256" },
        { name: "ipfsCID", type: "string" },
      ] as const;

      const domain = {
        name: "Axis Metadata Registry",
        version: "v1.0.0",
        chainId: BigInt(registry.chain.id),
        verifyingContract: registry.address,
      } as const;

      const address = JSON.parse(input.curatorProfilePayload).address;

      const message = {
        curator: address as Address,
        xId: userTwitterId,
        ipfsCID: curatorMetadataIpfsCid,
      } as const;

      const signature = (await walletClient.signTypedData({
        domain,
        types: {
          EIP712Domain: DOMAIN_TYPE,
          CuratorRegistration: REGISTRATION_TYPE,
        },
        primaryType: "CuratorRegistration",
        message,
      })) as `0x${string}`;

      console.log("Curator profile stored:", curatorMetadataIpfsCid, input);

      return {
        signature,
      };
    }),
});

export type AppRouter = typeof appRouter;

export const context = createContext;
