"use client";
import { LoaderIcon } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { DEFAULT_LIMIT } from "@/constants";
import { Checkbox } from "@/components/ui/checkbox";

interface TagsFilterProps {
  value?: string[] | null;
  onChange: (value: string[]) => void;
}

export const TagsFilter = ({ value, onChange }: TagsFilterProps) => {
  const trpc = useTRPC();
  //   useInfiniteQuery is a special function that helps you fetch data in a way that supports "infinite loading." It keeps track of the data you've already loaded and helps you fetch the next "page" of data when needed. Ned to have type of cursor input in order to use infiniteQuery

  //pagination to show how many tags we want to show on filter dropdown
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(
      trpc.tags.getMany.infiniteQueryOptions(
        { limit: DEFAULT_LIMIT },
        {
          getNextPageParam: (lastPage) => {
            return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
          },
        }
      )
    );

  const onClick = (tag: string) => {
    if (value?.includes(tag)) {
      onChange(value?.filter((item) => item !== tag) || []);
    } else {
      onChange([...(value || []), tag]);
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <LoaderIcon className="size-4 animate-spin" />
        </div>
      ) : (
        data?.pages.map((page) =>
          page.docs.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between cursor-pointer"
              onClick={() => onClick(tag.name)}
            >
              <p className="font-medium">{tag.name}</p>
              <Checkbox
                checked={value?.includes(tag.name)}
                onCheckedChange={() => onClick(tag.name)}
              />
            </div>
          ))
        )
      )}
      {hasNextPage && (
        <button
          onClick={() => {
            fetchNextPage();
          }}
          disabled={isFetchingNextPage}
          className="underline font-medium justify-start text-start disabled:opacity-50"
        >
          Load more...
          {/* {isFetchingNextPage ? (
            <LoaderIcon className="size-4 animate-spin" />
          ) : (
            "Load more"
          )} */}
        </button>
      )}
    </div>
  );
};
