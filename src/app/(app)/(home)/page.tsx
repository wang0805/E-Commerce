//server component direct to database nodejs api
// cannot use async in "use client" components
"use client";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export default function Home() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.auth.session.queryOptions());

  return (
    <div className="">
      <div>Home Page</div>
      <div>{JSON.stringify(data?.user)}</div>
    </div>
  );
}
