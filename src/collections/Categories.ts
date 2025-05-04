import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  access: {
    //set access level for roles
    // create: () => false,
    // update: () => false,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "color",
      type: "text",
    },
    {
      name: "parent",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
      // one category can have many categories but if the category doesnt have sub categories then it is the parent category i.e. creating hierarchical category structures.
    },
    {
      name: "subcategories",
      type: "join",
      collection: "categories",
      on: "parent",
      hasMany: true,
      //Provides a virtual, reverse relationship. It surfaces all categories that have the current category set as their parent. This is particularly useful in the admin UI for viewing and managing subcategories directly from a parent category.
    },
  ],
};
