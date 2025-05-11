"use client";

import React, { useState } from "react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavbarSidebar } from "./navbar-sidebar";

const poppins = Poppins({ subsets: ["latin"], weight: ["700"] });

interface NavbarItemProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}

const NavbarItem = ({ href, children, isActive }: NavbarItemProps) => {
  return (
    <Button
      asChild //Use Button styles on a <Link> tag & Wrap another custom interactive element
      variant="outline"
      className={cn(
        "bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg",
        isActive && "bg-black text-white hover:bg-black hover:text-white"
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  );
};

const navbarItems = [
  { href: "/", children: "Home" },
  { href: "/about", children: "About" },
  { href: "/features", children: "Features" },
  { href: "/pricing", children: "Pricing" },
  { href: "/contact", children: "Contact" },
];

const Navbar = () => {
  const pathname = usePathname(); // need to use "use client"
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <nav className="h-20 flex border-b justify-between font-medium bg-white">
      <Link href="/" className="pl-6 flex items-center">
        <span className={cn("text-5xl font-semibold", poppins.className)}>
          funroad
        </span>
      </Link>
      <NavbarSidebar
        items={navbarItems}
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />
      {/* hidden until reaches a lg breakpoint */}
      <div className="items-center gap-4 hidden lg:flex">
        {navbarItems.map((item) => (
          <NavbarItem
            key={item.href}
            href={item.href}
            isActive={item.href === pathname}
          >
            {item.children}
          </NavbarItem>
        ))}
      </div>
      <div className="hidden lg:flex">
        <Button
          asChild
          variant="secondary"
          className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-white hover:bg-pink-400 transition-colors text-lg"
        >
          <Link prefetch href="/sign-in">
            Log in
          </Link>
        </Button>
        <Button
          asChild
          variant="secondary"
          className="border-l border-t-0 border-b-0 border-r-0 px-12 h-full rounded-none bg-black text-white hover:bg-pink-400 hover:text-black transition-colors text-lg"
        >
          <Link prefetch href="/sign-up">
            Start Selling
          </Link>
          {/* the prefetch prop controls whether the linked pages resources r loaded in the background before the user navigates to it */}
        </Button>
      </div>
      <div className="lg:hidden flex items-center justify-center">
        <Button
          variant="ghost"
          className="size-12 border-transparent bg-white"
          onClick={() => setIsSidebarOpen(true)}
        >
          <MenuIcon />
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;

/// NOTES ///

// Without merging: "text-sm text-lg" — this causes text-lg to win, since it's last

// With merging (using tailwind-variants, tailwind-merge, or twMerge()): it resolves conflicts and removes text-sm, returning just "text-lg"

// The cn() function (often imported from a utility file) dynamically merges and cleans up class names, especially conditional ones.

// So this:

// cn("bg-white", isActive && "bg-blue-500")
// Results in:

// "bg-white" when isActive is false

// "bg-white bg-blue-500" when isActive is true

// children is a special React prop that represents anything nested inside a component when it is used.

// React.ReactNode is a TypeScript type that includes:

// strings → "Home"

// numbers → 123

// JSX → <span>Home</span>

// arrays of JSX → [<a />, <b />]

// null, undefined, false (often used for conditional rendering)

//interestingly, "use client" just means you are still doing SSR but not running a server component
