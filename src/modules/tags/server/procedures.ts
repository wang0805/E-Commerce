import { z } from "zod";
import { DEFAULT_LIMIT } from "@/constants";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const tagsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        // In this case, the cursor would hold the value of a unique identifier (like the id of the last item on the previous page) or a timestamp. The server would then query for items that come after this cursor value based on a specific sorting order.

        //pagination to show how many tags we want to show on filter dropdown
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await ctx.db.find({
        collection: "tags",
        page: input.cursor,
        limit: input.limit,
      });

      return data;
    }),
});

//add to _app.ts
