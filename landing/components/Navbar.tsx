"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomNavigationMenu } from "@/components/NavigationMenu";
import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";
import Image from "next/image";
import { appLink } from "@/lib/config";

export function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      {/* <div className="bg-primary">
        <div className="content-container py-2 text-center text-sm text-white">
          Find the perfect college for you!{" "}
          <Link
            href="https://app.pariksha.solutions/recommendation"
            target="_blank"
            className="underline"
          >
            College Recommendation System
          </Link>
        </div>
      </div> */}
      <nav className="w-full bg-white">
        <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
        <div className="content-container !px-0 !pr-2 md:!px-3">
          <div className="flex items-center justify-between py-3">
            <div className="flex w-full items-center justify-between">
              <div className="flex-shrink-0">
                <Link href="/" className="text-2xl font-bold text-gray-800">
                  <Image
                    src="/images/ParikshaLogo.png"
                    alt="Logo"
                    width={155}
                    height={47.63}
                    className="scale-90 md:scale-100"
                  />
                </Link>
              </div>
              <div className="mr-4 hidden lg:flex">
                <CustomNavigationMenu />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href={`${appLink}`}>
                <Button>Start Learning</Button>
              </Link>

              <Button
                variant="ghost"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
                onClick={toggleSidebar}
              >
                <span className="sr-only">Open main menu</span>
                <Menu className="h-10 w-10" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
