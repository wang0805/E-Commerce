"use client";

import { useState } from "react";
import { ListFilterIcon, SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { CustomCategory } from "../types";
import { CategoriesSidebar } from "./categories-sidebar";
import { Button } from "@/components/ui/button";

interface Props {
  data: CustomCategory[];
  disabled?: boolean;
}

export const SearchInput = ({ data, disabled }: Props) => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  return (
    <div className="flex items-center gap-2 w-full">
      <CategoriesSidebar
        open={isSideBarOpen}
        onOpenChange={setIsSideBarOpen}
        data={data}
      />
      <div className="relative w-full">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
        <Input
          className="pl-8"
          disabled={disabled}
          placeholder="Search Products"
        />
      </div>
      <Button
        variant="elevated"
        className="size-12 shrink-0 flex lg:hidden"
        onClick={() => setIsSideBarOpen(true)}
      >
        <ListFilterIcon />
      </Button>
    </div>
  );
};
