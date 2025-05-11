import "server-only"; // <-- ensure this file cannot be imported from the client
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache } from "react";
import { createTRPCContext } from "./init";
import { makeQueryClient } from "./query-client";
import { appRouter } from "./routers/_app";
// import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);
export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

// getting the caller for server-side calls (Payload docs) but does not add to cache
export const caller = appRouter.createCaller(createTRPCContext);
// If your router is on a separate server, pass a client:
// createTRPCOptionsProxy({
//   client: createTRPCClient({
//     links: [httpLink({ url: '...' })],
//   }),
//   queryClient: getQueryClient,
// });

// export function HydrateClient(props: { children: React.ReactNode }) {
//   const queryClient = getQueryClient();
//   return (
//     <HydrationBoundary state={dehydrate(queryClient)}>
//       {props.children}
//     </HydrationBoundary>
//   );
// }
