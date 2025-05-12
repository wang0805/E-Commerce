//creating another home layout for the home page (and not touch the rootlayout) which will apply for all pages inside the (home) folder
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import { Suspense } from "react";

import Navbar from "@/modules/home/ui/components/navbar";
import Footer from "@/modules/home/ui/components/footer";
import {
  SearchFilters,
  SearchFiltersLoading,
} from "@/modules/home/ui/components/search-filters";

interface Props {
  children: React.ReactNode;
}

const layout = async ({ children }: Props) => {
  // DATA MOVED TO BE FETCHED VIA SERVER TRPC
  // const payload = await getPayload({ config });

  // const data = await payload.find({
  //   collection: "categories",
  //   depth: 1, //just 1 subcategory and nothing deeper. If 0, there will be weir subcaregories
  //   pagination: false,
  //   where: {
  //     parent: {
  //       exists: false,
  //     },
  //   },
  //   sort: "name",
  // });

  // const formattedData: CustomCategory[] = data.docs.map((doc) => ({
  //   ...doc,
  //   subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
  //     ...(doc as Category), // or (doc as Category) for type assertions
  //     subcategories: undefined, // remove subcategories from the subcategories because theres only 1 depth (layer)
  //   })),
  // }));

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<SearchFiltersLoading />}>
          <SearchFilters />
        </Suspense>
      </HydrationBoundary>
      <div className="flex-1 bg-[#F4F4F0]">{children}</div>{" "}
      {/* flex-1 makes the children take up the remaining space */}
      <Footer />
    </div>
  );
};

export default layout;
