//creating another home layout for the home page (and not touch the rootlayout) which will apply for all pages inside the (home) folder
import configPromise from "@payload-config";
import { getPayload } from "payload";

import Navbar from "./navbar";
import Footer from "./footer";
import { SearchFilters } from "./search-filters";
import { Category } from "@/payload-types";

interface Props {
  children: React.ReactNode;
}

const layout = async ({ children }: Props) => {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
    depth: 1, //just 1 subcategory and nothing deeper. If 0, there will be weir subcaregories
    pagination: false,
    where: {
      parent: {
        exists: false,
      },
    },
  });

  const formattedData = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
      ...(doc as Category), // or (doc as Category) for type assertions
      subcategories: undefined, // remove subcategories from the subcategories because theres only 1 depth (layer)
    })),
  }));

  console.log({ data, formattedData });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilters data={formattedData} />
      <div className="flex-1 bg-[#F4F4F0]">{children}</div>{" "}
      {/* flex-1 makes the children take up the remaining space */}
      <Footer />
    </div>
  );
};

export default layout;
