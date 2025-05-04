//fix the dropdown position of categories
// we are passing the dropdownref from category-dropdown <div> here
import { RefObject } from "react";

export const useDropdownPosition = (
  ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>
) => {
  const getDropdownPosition = () => {
    // if cannot detect any subcategories, means doesnt matter
    if (!ref.current) return { top: 0, left: 0 };

    const rect = ref.current.getBoundingClientRect();
    const dropdownWidth = 240; // width of dropdown (w-60 - 15rem = 240px) this w-60 is applied to subcategory menu

    // calculate the initial position
    let left = rect.left + window.scrollX;
    const top = rect.bottom + window.scrollY;

    // check if dropdown would go off the right edge of the viewport
    if (left + dropdownWidth > window.innerWidth) {
      //align to right edge of button instead
      left = rect.right + window.scrollX - dropdownWidth;
      // If still off-screen, align to the right edge of viewport with some padding
      if (left < 0) {
        left = window.innerWidth - dropdownWidth - 16;
      }
    }
    //ensure dropdown doesnt go off left edge
    if (left < 0) {
      left = 16;
    }
    return { top, left };
  };

  return {
    getDropdownPosition,
  };
};
