import { Category } from "@/payload-types";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.find({
      collection: "categories",
      depth: 1, //just 1 subcategory and nothing deeper. If 0, there will be weir subcaregories
      pagination: false,
      where: {
        parent: {
          exists: false,
        },
      },
      sort: "name",
    });

    const formattedData = data.docs.map((doc) => ({
      ...doc,
      subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
        ...(doc as Category), // or (doc as Category) for type assertions
        // subcategories: undefined, // remove subcategories from the subcategories because theres only 1 depth (layer)
      })),
    }));

    return formattedData;
  }),
});
