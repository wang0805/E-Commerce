import { Suspense } from "react";

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  ProductList,
  ProductListSkeleton,
} from "@/modules/products/ui/components/product-list";

// The use hook can be used in Server Components to read the value of a Promise and suspend rendering until the data is available. By passing a Promise, the framework enables the component (or a parent Suspense boundary) to handle the loading state gracefully. While the Promise is pending, a loading fallback can be shown. Once the Promise resolves, the component can render with the final params value. This can also simplify the code compared to managing the Promise with useEffect and state in older patterns.
interface Props {
  params: Promise<{ subcategory: string }>;
}

const Page = async ({ params }: Props) => {
  const { subcategory } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({
      category: subcategory,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList category={subcategory} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default Page;
