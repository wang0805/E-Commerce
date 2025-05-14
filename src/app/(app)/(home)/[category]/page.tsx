import { Suspense } from "react";
import type { SearchParams } from "nuqs";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  ProductList,
  ProductListSkeleton,
} from "@/modules/products/ui/components/product-list";
import { ProductFilters } from "@/modules/products/ui/components/product-filters";
import { loadProductFilters } from "@/modules/products/search-params";
import { ProductSort } from "@/modules/home/ui/components/product-sort";

// The use hook can be used in Server Components to read the value of a Promise and suspend rendering until the data is available. By passing a Promise, the framework enables the component (or a parent Suspense boundary) to handle the loading state gracefully. While the Promise is pending, a loading fallback can be shown. Once the Promise resolves, the component can render with the final params value. This can also simplify the code compared to managing the Promise with useEffect and state in older patterns.
interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<SearchParams>;
}

// this is a replacement for loadProductFilters, its easier this way esp if u have many filters, like tag etc u gotta add them all individually
// interface Props {
//   params: Promise<{ category: string }>;
//   searchParams: Promise<{ minPrice: string; maxPrice: string }>;
// }

const Page = async ({ params, searchParams }: Props) => {
  const { category } = await params;
  // this is a replacement for loadProductFilters
  // const { minPrice, maxPrice } = await searchParams;
  const filters = await loadProductFilters(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category,
      ...filters,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="px-4 lg:px-12 py-8 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 justify-between">
          <p className="text-2xl font-medium">Curated for you</p>
          <ProductSort />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12 ">
          <div className="lg:col-span-2 xl:col-span-2">
            <ProductFilters />
          </div>
          <div className="lg:col-span-4 xl:col-span-6">
            <Suspense fallback={<ProductListSkeleton />}>
              <ProductList category={category} />
            </Suspense>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default Page;
