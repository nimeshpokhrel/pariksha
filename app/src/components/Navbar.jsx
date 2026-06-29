"use client";

import React from "react";
import {
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from "@chakra-ui/react";
import Link from "next/link";
import { useAuth } from "@/utils/AuthContext";
import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "@/hooks/auth";

import Image from "next/image";

import { FaRegUser } from "react-icons/fa";
// import PwaInstallButton from "./PwaInstallButton";
import { CiMenuBurger } from "react-icons/ci";
import { FaArrowLeftLong } from "react-icons/fa6";
import { LuGraduationCap } from "react-icons/lu";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { usePathname } from "next/navigation";
import { MdHistory } from "react-icons/md";

// import PwaInstallSidebar from "./PwaInstallSidebar";
import { Book, BookOpen, FileText } from "lucide-react";
import { UserAvatar } from "./UserAvatar";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const {
    isOpen: navDrawer,
    onOpen: onNavDrawerOpen,
    onClose: onNavDrawerClose,
  } = useDisclosure();

  const userLogout = useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      logout();
      router.replace("/login");
    },
  });

  const hideNavbar = pathname.startsWith("/login");

  if (hideNavbar) return null;

  return (
    <div className="pb-20">
      <Drawer
        isOpen={navDrawer}
        onClose={onNavDrawerClose}
        placement="right"
        size={"sm"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader className="flex items-center gap-8 border-b-4 border-b-gray-300">
            <button onClick={onNavDrawerClose}>
              <FaArrowLeftLong />
            </button>
            Account & Settings
          </DrawerHeader>

          <DrawerBody padding={0}>
            {user && (
              <Link href="/profile" onClick={onNavDrawerClose}>
                <div className="flex items-center gap-6 border-b-4 border-b-gray-300 px-6 py-4">
                  <UserAvatar name={user.fullName} size="xl" />
                  <div>
                    <h1 className="mb-2 text-lg font-semibold">
                      {user.fullName}
                    </h1>
                    <p className="text-sm">{user.email}</p>
                    <p className="text-sm">{user.contactNumber}</p>
                  </div>
                </div>
              </Link>
            )}
            <div className="mt-4 flex flex-col border-b-4 border-b-gray-300">
              <p className="mb-2 px-6 text-xs text-gray-600">ACCOUNT</p>
              <Link
                href={"/profile"}
                className="flex items-center gap-2 border-b border-b-gray-300 px-6 py-2 hover:bg-gray-50 active:bg-gray-50"
                onClick={onNavDrawerClose}
              >
                <FaRegUser size={16} /> Profile
              </Link>
              <Link
                href={"/watch-history"}
                className="flex items-center gap-2 border-b border-b-gray-300 px-6 py-2 hover:bg-gray-50 active:bg-gray-50"
                onClick={onNavDrawerClose}
              >
                <MdHistory size={16} /> Watch History
              </Link>
              <Link
                href={"/test-history"}
                className="flex items-center gap-2 border-b border-b-gray-300 px-6 py-2 hover:bg-gray-50 active:bg-gray-50"
                onClick={onNavDrawerClose}
              >
                <FileText size={16} /> Test History
              </Link>
              <Link
                href={"/my-learning"}
                className="flex items-center gap-2 border-b border-b-gray-300 px-6 py-2 hover:bg-gray-50 active:bg-gray-50"
                onClick={onNavDrawerClose}
              >
                <BookOpen size={16} /> My Learning
              </Link>
            </div>
            <div className="mt-4 flex flex-col border-b-4 border-b-gray-300">
              <p className="mb-2 px-6 text-xs text-gray-600">APP</p>
              <Link
                href="/courses"
                className="flex items-center gap-2 border-b border-b-gray-300 px-6 py-2 hover:bg-gray-50 active:bg-gray-50"
                onClick={onNavDrawerClose}
              >
                <Book size={16} /> Explore Courses
              </Link>
              {user &&
                (user.userType === "Admin" ||
                  user.userType === "SuperAdmin") && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2 border-b border-b-gray-300 px-6 py-2 hover:bg-gray-50 active:bg-gray-50"
                    onClick={onNavDrawerClose}
                  >
                    <MdOutlineAdminPanelSettings size={16} /> Admin
                  </Link>
                )}
              <Link
                href="/recommendation"
                className="flex items-center gap-2 border-b border-b-gray-300 px-6 py-2 hover:bg-gray-50 active:bg-gray-50"
                onClick={onNavDrawerClose}
              >
                <LuGraduationCap size={16} /> College Recommendation
              </Link>
              {/* <PwaInstallSidebar /> */}
            </div>
            <div className="mt-8 px-6">
              {!user && (
                <Link href="/login" onClick={onNavDrawerClose}>
                  <button className="w-full rounded-full border-2 border-solid border-black px-8 py-4">
                    LOGIN
                  </button>
                </Link>
              )}
              {user && (
                <button
                  onClick={() => {
                    userLogout.mutate();
                    onNavDrawerClose();
                  }}
                  className="w-full rounded-full border-2 border-solid border-black px-8 py-4"
                >
                  LOGOUT
                </button>
              )}
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <div className="navContainer fixed z-[49] flex h-20 w-full items-center justify-between border-b-2 border-b-gray-200 bg-white px-5 py-4">
        <div className="logoContainer">
          <Link href="/">
            <picture>
              <source media="(max-width: 800px)" srcSet={"/logo/PLogo.png"} />
              <source
                media="(min-width: 800px)"
                srcSet={"/logo/ParikshaLogo.png"}
              />
              <Image
                src={"/logo/PLogo.png"}
                alt="Pariksha"
                height={48}
                width={48}
                className="min-[801px]:w-40"
              />
            </picture>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          {/* <Link
            href="https://pariksha.solutions/partner-colleges/"
            className="rounded-md bg-secondary px-4 py-2 font-bold text-white max-[550px]:text-xs"
            target="_blank"
          >
            Partner Colleges
          </Link> */}

          {/* <PwaInstallButton /> */}
          <button onClick={onNavDrawerOpen} className="cursor-pointer">
            <CiMenuBurger className="text-black" size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
