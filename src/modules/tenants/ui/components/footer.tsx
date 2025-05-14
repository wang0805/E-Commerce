import Link from "next/link";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const poppins = Poppins({ subsets: ["latin"], weight: ["700"] });

export const Footer = () => {
  return (
    <footer className="border-t font-medium bg-white">
      <div className="max-w-(--breakpoint-xl) max-auto flex items-center h-full px-4 py-4 lg:px-12 gap-2">
        <p>Powered By</p>
        <Link href="/">
          <span className={cn(poppins.className, "text-2xl font-semibold")}>
            funroad
          </span>
        </Link>
      </div>
    </footer>
  );
};
