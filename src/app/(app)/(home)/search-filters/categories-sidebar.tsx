import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { CustomCategory } from "../types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: CustomCategory[]; // To remove later
}

export const CategoriesSidebar = ({ open, onOpenChange, data }: Props) => {
  const router = useRouter();
  //state can be null or an array of customcategorie objects
  const [parentCategories, setParentCategories] = useState<
    CustomCategory[] | null
  >(null);
  const [selectedCategory, setSelectedCategory] =
    useState<CustomCategory | null>(null);

  // if we have parent categories, show those, otherwise show root categories
  const currentCategories = parentCategories ?? data ?? []; // ?? means Return the first value that is NOT null or undefined

  const handleOpenChange = (open: boolean) => {
    //reset everything when closed
    onOpenChange(open);
    setSelectedCategory(null);
    setParentCategories(null);
  };

  const handleCategoryClick = (category: CustomCategory) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CustomCategory[]); // if category has subcategories, then it sets them as parents when clicked
      setSelectedCategory(category); // save which category was clicked, for a back button
    } else {
      // this is a leaf category (no subcategories)
      if (parentCategories && selectedCategory) {
        // this is subcategory, navigate to subcategory
        router.push(`/${selectedCategory.slug}/${category.slug}`);
      } else {
        // this is main category, navigate to main category
        if (category.slug === "all") {
          router.push(`/`);
        } else {
          router.push(`/${category.slug}`);
        }
      }

      handleOpenChange(false);
    }
  };

  const handleBackClick = () => {
    // null goes back to data which is all
    if (parentCategories) {
      setParentCategories(null);
      setSelectedCategory(null);
    }
  };

  const backgroundColor = selectedCategory?.color || "white";

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        className="p-0 transition-none"
        style={{ backgroundColor: backgroundColor }}
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {parentCategories && (
            <button
              onClick={() => handleBackClick()}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium cursor-pointer"
            >
              <ChevronLeftIcon className="mr-2 size-4" />
              Back
            </button>
          )}
          {currentCategories.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleCategoryClick(category)}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center text-base font-medium cursor-pointer"
            >
              {category.name}
              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronRightIcon className="size-4" />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
