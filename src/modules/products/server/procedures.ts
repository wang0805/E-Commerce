import { z } from "zod";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import type { Sort, Where } from "payload";
import { Category } from "@/payload-types";
import { sortValues } from "@/modules/products/search-params";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};
      let sort: Sort = "-createdAt";
      if (input.sort === "curated") {
        sort = "-createdAt";
      }

      if (input.sort === "trending") {
        sort = "-createdAt";
      }

      if (input.sort === "hot_and_new") {
        sort = "-createdAt";
      }
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

        //equals, greater_than_equal, less_than_equal are native query API provided by Payload CMS

        if (input.minPrice && input.maxPrice) {
          where.price = {
            greater_than_equal: input.minPrice,
            less_than_equal: input.maxPrice,
          };
        } else if (input.minPrice) {
          where.price = {
            greater_than_equal: input.minPrice,
          };
        } else if (input.maxPrice) {
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

      if (input.tags && input.tags.length > 0) {
        where["tags.name"] = {
          in: input.tags,
        };
      }
      const data = await ctx.db.find({
        collection: "products",
        depth: 1, //just category and image, if 0 will not have those 2
        where,
        sort,
      });

      // simulate fake delay
      // await new Promise((resolve) => setTimeout(resolve, 5000));

      return data;
    }),
});

//add to _app.ts
