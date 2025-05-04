import { Category } from "@/payload-types";
import { CategoryDropdown } from "./category-dropdown";

interface Props {
  data: any;
}

export const Categories = ({ data }: Props) => {
  return (
    //   <div>Categories: {JSON.stringify(data, null, 2)}</div>
    <div className="relative w-full">
      {/* this <div> to fix the arrow that links the dropdown */}
      <div className="flex flex-nowrap items-center">
        {data.map((category: Category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={false}
              isNavigationHovered={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
