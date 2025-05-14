import { z } from "zod";

import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import type { Sort, Where } from "payload";
import { Category, Media, Tenant } from "@/payload-types";
import { sortValues } from "@/modules/products/search-params";
import { DEFAULT_LIMIT } from "@/constants";

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1), //pagination to show how many products we want to show on filter dropdown
        limit: z.number().default(DEFAULT_LIMIT), //pagination to limit how many products we want to show on filter dropdown
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortValues).nullable().optional(),
        tenantSlug: z.string().nullable().optional(),
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

      if (input.tenantSlug) {
        where["tenant.slug"] = {
          equals: input.tenantSlug,
        };
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
        depth: 2, //just category, tenant and image, if 0 will not have those 2. 2 for tenant.image
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
      });

      // simulate fake delay
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      // console.log(JSON.stringify(data.docs, null, 2));
      return {
        ...data,
        docs: data.docs.map((doc) => ({
          ...doc,
          image: doc.image as Media | null,
          tenant: doc.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});

//add to _app.ts
