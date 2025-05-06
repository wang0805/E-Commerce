import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/trpc/routers/_app";

// substitute the customCategory we created

export type CategoriesGetManyOutput =
  inferRouterOutputs<AppRouter>["categories"]["getMany"];
export type CategoriesGetManyOutputSingle = CategoriesGetManyOutput[0];
