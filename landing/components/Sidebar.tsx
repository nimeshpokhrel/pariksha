import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import * as React from "react";
import { cn } from "@/lib/utils";
import { CiSearch, CiLocationOn, CiTimer } from "react-icons/ci";
import { GraduationCap } from "lucide-react";
import Image from "next/image";

const navigationItems = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Universities",
    href: "/products",
    subItems: [
      {
        title: "International American University",
        description: "Los Angeles, USA",
        href: "/universities/international-american-university",
        icon: "mapPin",
      },
      {
        title: "Coventry University",
        description: "West Midlands , England",
        href: "/universities/coventry-university",
        icon: "mapPin",
      },
      {
        title: "Tribhuvan University",
        description: "Kathmandu Nepal",
        href: "/universities/tribhuvan-university",
        icon: "mapPin",
      },
      {
        title: "Explore All Universities",
        description: "",
        href: "/universities",
        icon: "searchIcon",
      },
    ],
  },
  {
    title: "Sectors",
    href: "/sectors",
    subItems: [
      {
        title: "Computer Science & IT",
        description: "30+ Degrees",
        href: "/sectors/computer-science-it",
        icon: "degreesIcon",
      },
      {
        title: "Business and Management",
        description: "20+ Degrees",
        href: "/sectors/business-and-management",
        icon: "degreesIcon",
      },
      {
        title: "LAW",
        description: "10+ Degrees",
        href: "/sectors/law",
        icon: "degreesIcon",
      },
      {
        title: "Explore All Sectors",
        description: "",
        href: "/sectors",
        icon: "searchIcon",
      },
    ],
  },
  {
    title: "Degrees",
    href: "/degrees",
    subItems: [
      {
        title: "BBA - TU",
        description: "4 Yrs ・ 8 Semesters",
        href: "/degrees/bba-tu",
        icon: "timeIcon",
      },
      {
        title: "BSC-CSIT - TU",
        description: "4 Yrs ・ 8 Semesters",
        href: "/degrees/csit-tu",
        icon: "timeIcon",
      },
      {
        title: "BIT - MIT",
        description: "4 Yrs ・ 8 Semesters",
        href: "/degrees/bit-iau",
        icon: "timeIcon",
      },
      {
        title: "Explore All Degrees",
        description: "",
        href: "/degrees",
        icon: "searchIcon",
      },
    ],
  },
  {
    title: "Colleges",
    href: "/colleges",
    subItems: [
      {
        title: "Softwarica College of IT",
        description: "Maitri Marg, Dillibazar",
        href: "/colleges/softwarica",
        icon: "mapPin",
      },
      {
        title: "Samriddhi College",
        description: "Lokanthali Bhaktapur",
        href: "/colleges/samriddhi-college",
        icon: "mapPin",
      },
      {
        title: "Explore all colleges",
        description: "",
        href: "/colleges",
        icon: "searchIcon",
      },
    ],
  },
  {
    title: "Counselling",
    href: "/counselling",
  },
  {
    title: "Entrance Result",
    href: "/entrance-result",
  },
  {
    title: "Blogs",
    href: "/blogs",
  },
  {
    title: "About Us",
    href: "/about-us",
  },
  {
    title: "Contact Us",
    href: "/contact-us",
  }
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav>
          <Accordion type="single" collapsible className="w-full">
            {navigationItems.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={item.title}>
                {item.subItems ? (
                  <>
                    <AccordionTrigger>{item.title}</AccordionTrigger>
                    <AccordionContent>
                      <ul>
                        {item.title == "Colleges" && (
                          <Link
                            className="from-muted/50 flex h-full w-full select-none flex-col justify-end rounded-md p-4 no-underline outline-none focus:shadow-md"
                            href="/colleges/mit"
                            onClick={onClose}
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
                        )}
                        {item.subItems.map((subItem) => (
                          <li key={subItem.title} className="mb-2">
                            <ListItem
                              title={subItem.title}
                              href={subItem.href}
                              icon={subItem.icon}
                              onClick={onClose}
                            >
                              {subItem.description}
                            </ListItem>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="flex h-12 items-center justify-between py-2 text-sm text-gray-600 hover:text-gray-900"
                    onClick={onClose}
                  >
                    {item.title}
                  </Link>
                )}
              </AccordionItem>
            ))}
          </Accordion>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

interface ListItemProps extends React.ComponentPropsWithoutRef<"a"> {
  href: string;
  title: string;
  icon: string;
  onClick?: () => void;
}

const ListItem = React.forwardRef<HTMLAnchorElement, ListItemProps>(
  ({ className, title, children, icon, href, onClick, ...props }, ref) => {
    return (
      <Link
        href={href}
        ref={ref}
        className={cn(
          "flex h-full cursor-pointer select-none flex-col justify-center space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className,
        )}
        onClick={onClick}
        {...props}
      >
        <div className="flex items-center gap-2 text-sm font-medium leading-none">
          {icon == "searchIcon" && <CiSearch className="h-6 w-6" />}
          {title}
        </div>
        <div className="mt-2 flex gap-0.5 text-muted-foreground">
          {icon == "mapPin" && <CiLocationOn className="h-4 w-4" />}
          {icon == "degreesIcon" && (
            <GraduationCap className="mx-0.5 h-4 w-4" />
          )}
          {icon == "timeIcon" && <CiTimer className="mx-0.5 h-4 w-4" />}
          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
            {children}
          </p>
        </div>
      </Link>
    );
  },
);

ListItem.displayName = "ListItem";
