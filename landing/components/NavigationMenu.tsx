"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import { CiSearch, CiLocationOn, CiTimer } from "react-icons/ci";
import { GraduationCap } from "lucide-react";

const universityItems: {
  title: string;
  description: string;
  href: string;
  mapPin?: boolean;
  searchIcon?: boolean;
}[] = [
  {
    title: "International American University",
    description: "Los Angeles, USA",
    href: "/universities/international-american-university",
    mapPin: true,
  },
  {
    title: "Coventry University",
    description: "West Midlands , England",
    href: "/universities/coventry-university",
    mapPin: true,
  },
  {
    title: "Tribhuvan University",
    description: "Kathmandu Nepal",
    href: "/universities/tribhuvan-university",
    mapPin: true,
  },
  {
    title: "Explore All Universities",
    description: "",
    href: "/universities",
    searchIcon: true,
  },
];

const sectorsItems: {
  title: string;
  href: string;
  description: string;
  degreesIcon?: boolean;
  searchIcon?: boolean;
}[] = [
  {
    title: "Computer Science & IT",
    description: "30+ Degrees",
    href: "/sectors/computer-science-it",
    degreesIcon: true,
  },
  {
    title: "Business & Management",
    description: "20+ Degrees",
    href: "/sectors/business-and-management",
    degreesIcon: true,
  },
  {
    title: "LAW",
    description: "10+ Degrees",
    href: "/sectors/law",
    degreesIcon: true,
  },
  {
    title: "Explore All Sectors",
    description: "",
    href: "/sectors",
    searchIcon: true,
  },
];

const degreesItems: {
  title: string;
  href: string;
  description: string;
  timeIcon?: boolean;
  searchIcon?: boolean;
}[] = [
  {
    title: "BBA - TU",
    description: "4 Yrs ・ 8 Semesters",
    href: "/degrees/bba-tu",
    timeIcon: true,
  },
  {
    title: "BSC-CSIT - TU",
    description: "4 Yrs ・ 8 Semesters",
    href: "/degrees/csit-tu",
    timeIcon: true,
  },
  {
    title: "BIT - MIT",
    description: "4 Yrs ・ 8 Semesters",
    href: "/degrees/bit-iau",
  },
  {
    title: "Explore All Degrees",
    description: "",
    href: "/degrees",
    searchIcon: true,
  },
];

const collegesItems: {
  title: string;
  href: string;
  description: string;
  searchIcon?: boolean;
  mapPin?: boolean;
}[] = [
  {
    title: "Softwarica College of IT",
    description: "Maitri Marg, Dillibazar",
    href: "/colleges/softwarica",
    mapPin: true,
  },
  {
    title: "Samriddhi College",
    description: "Lokanthali Bhaktapur",
    href: "/colleges/samriddhi-college",
    mapPin: true,
  },
  {
    title: "Explore all colleges",
    description: "",
    href: "/colleges",
    searchIcon: true,
  },
];

export function CustomNavigationMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-1.5">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-white">
            Universities
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid p-3 md:w-[400px] lg:w-[600px] lg:grid-cols-[1fr_1fr]">
              {universityItems.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                  searchIcon={component.searchIcon}
                  mapPin={component.mapPin}
                  className="p-6"
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-white">
            Sectors
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid p-3 md:w-[400px] lg:w-[500px] lg:grid-cols-[1fr_1fr]">
              {sectorsItems.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                  searchIcon={component.searchIcon}
                  degreesIcon={component.degreesIcon}
                  className="p-6"
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-white">
            Degrees
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              {degreesItems.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                  searchIcon={component.searchIcon}
                  timeIcon={component.timeIcon}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-white">
            Colleges
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid px-2 py-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.85fr_1fr]">
              <li className="row-span-3 mr-2">
                <NavigationMenuLink asChild>
                  <Link
                    className="from-muted/50 flex h-full w-full select-none flex-col justify-end rounded-md bg-gray-100 p-6 no-underline outline-none focus:shadow-md"
                    href="/colleges/mit"
                  >
                    <Image
                      src="/images/MITLogo.png"
                      alt="College Logo"
                      width={100}
                      height={150}
                      className="mx-auto"
                    />
                    <div className="mb-2 mt-4 font-medium leading-5">
                      Model Institute of Technology (MIT)
                    </div>
                    <p className="text-xs leading-tight text-muted-foreground">
                      A college Inspiring Innovative Intelligence
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              {collegesItems.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                  searchIcon={component.searchIcon}
                  mapPin={component.mapPin}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            href="/counselling"
            className="inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
          >
            Counselling
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            href="/entrance-result"
            className="inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
          >
            Entrance Result
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  href: string;
  title: string;
  searchIcon?: boolean;
  mapPin?: boolean;
  degreesIcon?: boolean;
  timeIcon?: boolean;
}

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  (
    {
      className,
      title,
      children,
      searchIcon,
      mapPin,
      degreesIcon,
      timeIcon,
      href,
      ...props
    },
    ref,
  ) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            href={href}
            ref={ref}
            className={cn(
              "flex h-full cursor-pointer select-none flex-col justify-center space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div
              className={`flex items-center gap-2 text-sm font-medium leading-none`}
            >
              {searchIcon && <CiSearch className="h-6 w-6" />}
              {title}
            </div>
            <div className="mt-2 flex gap-0.5 text-muted-foreground">
              {mapPin && <CiLocationOn className="h-4 w-4" />}
              {degreesIcon && <GraduationCap className="mx-0.5 h-4 w-4" />}
              {timeIcon && <CiTimer className="mx-0.5 h-4 w-4" />}
              <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                {children}
              </p>
            </div>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  },
);

ListItem.displayName = "ListItem";
