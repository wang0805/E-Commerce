import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { Tenant, Media } from "@/payload-types";

export const tenantsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(
      z.object({
        slug: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const tenantsData = await ctx.db.find({
        collection: "tenants",
        where: {
          slug: {
            equals: input.slug,
          },
        },
        limit: 1,
        depth: 2,
        pagination: false,
      });

      const tenant = tenantsData.docs[0];

      if (!tenant) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Tenant not found" });
      }
      return tenant as Tenant & { image: Media | null };
    }),
});

//add to _app.ts
