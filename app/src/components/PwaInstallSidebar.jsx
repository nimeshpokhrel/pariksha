"use client";

import React from "react";

import { MdOutlineFileDownload } from "react-icons/md";
import { usePwaInstall } from "@/utils/PwaInstallContext";

const PwaInstallSidebar = () => {
  const { pwaInstall } = usePwaInstall();

  return (
    <>
      <button
        onClick={pwaInstall}
        className="flex items-center gap-2 border-b border-b-gray-300 px-6 py-2 hover:bg-gray-50 active:bg-gray-50"
      >
        <MdOutlineFileDownload size={20} /> Install App
      </button>
    </>
  );
};

export default PwaInstallSidebar;
