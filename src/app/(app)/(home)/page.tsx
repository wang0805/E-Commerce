import type { SearchParams } from "nuqs/server";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { DEFAULT_LIMIT } from "@/constants";

// The use hook can be used in Server Components to read the value of a Promise and suspend rendering until the data is available. By passing a Promise, the framework enables the component (or a parent Suspense boundary) to handle the loading state gracefully. While the Promise is pending, a loading fallback can be shown. Once the Promise resolves, the component can render with the final params value. This can also simplify the code compared to managing the Promise with useEffect and state in older patterns.
interface Props {
  searchParams: Promise<SearchParams>;
}

// this is a replacement for loadProductFilters, its easier this way esp if u have many filters, like tag etc u gotta add them all individually
// interface Props {
//   params: Promise<{ category: string }>;
//   searchParams: Promise<{ minPrice: string; maxPrice: string }>;
// }

const Page = async ({ searchParams }: Props) => {
  const filters = await loadProductFilters(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      limit: DEFAULT_LIMIT,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView />
    </HydrationBoundary>
  );
};

export default Page;
