import { initTRPC } from "@trpc/server";
import { cache } from "react";
import config from "@payload-config";
import { getPayload } from "payload";

export const createTRPCContext = cache(async () => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: "user_123" };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  // transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
// every procedure need to await payload so added here so we dont have to keep adding this line of code in all the procedures in procedures.ts
export const baseProcedure = t.procedure.use(async ({ next }) => {
  const payload = await getPayload({ config });
  //In tRPC, middleware functions can modify the context object by passing a new ctx to the next function. This allows you to inject additional data into the context that subsequent procedures can access.
  return next({ ctx: { db: payload } });
});
// export const baseProcedure = t.procedure;
