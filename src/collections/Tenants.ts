import type { CollectionConfig } from "payload";

export const Tenants: CollectionConfig = {
  slug: "tenants",
  admin: {
    useAsTitle: "slug",
  },
  fields: [
    {
      name: "slug",
      type: "text",
      index: true,
      required: true,
      unique: true,
      admin: {
        description:
          "This is the subdomain for the store (e.g. [slug].domain.com",
      },
    },
    {
      name: "name",
      type: "text",
      label: "Store Name",
      admin: {
        description: "The name of the store (e.g. Wangy Store)", //this is for the admin UI for the person looking at admin dashboard
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "stripeAccountId", //ensure the person who owns this tenant has verified his details with strip
      type: "text",
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "stripeDetailsSubmitted",
      type: "checkbox", //boolean
      admin: {
        readOnly: true,
        description:
          "You cannot create products until you submit your Stripe details",
      },
    },
  ],
};
