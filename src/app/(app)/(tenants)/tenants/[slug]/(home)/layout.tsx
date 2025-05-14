import { Suspense } from "react";

import { getQueryClient, trpc } from "@/trpc/server";

import { Navbar } from "@/modules/tenants/ui/components/navbar";
import { Footer } from "@/modules/tenants/ui/components/footer";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { NavbarSkeleton } from "@/modules/tenants/ui/components/navbar";

interface LayoutProps {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

const layout = async ({ children, params }: LayoutProps) => {
  const { slug } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.tenants.getOne.queryOptions({
      slug,
    })
  );
  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<NavbarSkeleton />}>
          <Navbar slug={slug} />
        </Suspense>
      </HydrationBoundary>
      <div className="flex-1">
        <div className="max-w-(--breakpoint-xl) mx-auto">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default layout;
