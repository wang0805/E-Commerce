import { z } from "zod";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import type { Where } from "payload";
import { Category } from "@/payload-types";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().nullable().optional(),
        minPrice: z.number().nullable().optional(),
        maxPrice: z.number().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};
      if (input.category) {
        const categoriesData = await ctx.db.find({
          collection: "categories",
          depth: 1, //populate subcategories, subcat[0] will be of type category
          limit: 1,
          pagination: false,
          where: {
            slug: {
              equals: input.category,
            },
          },
        });

        if (input.minPrice) {
          where.price = {
            greater_than_equal: input.minPrice,
          };
        }

        if (input.maxPrice) {
          where.price = {
            less_than_equal: input.maxPrice,
          };
        }

        // console.log(
        //   // JSON.stringify(categoriesData, null, 2),
        //   categoriesData.docs[0].subcategories
        // );

        const formattedData = categoriesData.docs.map((doc) => ({
          ...doc,
          subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
            // because of depth:1 we are confident doc will be a type of cateogory
            ...(doc as Category), // or (doc as Category) for type assertions
            subcategories: undefined, // remove subcategories from the subcategories because theres only 1 depth (layer)
          })),
        }));
        const subcategories = [];
        const parentCategory = formattedData[0];

        if (parentCategory) {
          subcategories.push(
            ...parentCategory.subcategories.map(
              (subcategory) => subcategory.slug
            )
          );
          where["category.slug"] = {
            in: [parentCategory.slug, ...subcategories],
          };
        }
      }
      const data = await ctx.db.find({
        collection: "products",
        depth: 1, //just category and image, if 0 will not have those 2
        where,
      });

      // simulate fake delay
      // await new Promise((resolve) => setTimeout(resolve, 5000));

      return data;
    }),
});

//add to _app.ts
