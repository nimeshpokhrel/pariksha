"use client";

import React from "react";
import PrimaryButton from "./PrimaryButton";
import { FaDownload } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { usePwaInstall } from "@/utils/PwaInstallContext";

const PwaInstallButton = () => {
  const { pwaInstall, supportsPWA } = usePwaInstall();
  const pathname = usePathname();

  return (
    <>
      {supportsPWA && (
        <PrimaryButton
          className={"hidden w-max rounded-lg sm:block"}
          text={"Install App"}
          onClick={pwaInstall}
        />
      )}
      {supportsPWA && pathname === "/" && (
        <button
          className="fixed bottom-10 right-5 rounded-full bg-secondary p-5 text-white shadow-2xl hover:bg-primary active:bg-primaryDark sm:hidden"
          onClick={pwaInstall}
        >
          <FaDownload size={32} />
        </button>
      )}
    </>
  );
};

export default PwaInstallButton;
