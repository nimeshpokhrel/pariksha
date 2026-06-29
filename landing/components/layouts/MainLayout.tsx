import React from "react";
import { Navbar } from "../Navbar";
import { ReactNode } from "react";
import Footer from "../Footer";
import FloatingButtons from "../FloatingButtons";
import CounsellingPopup from "../CounsellingPopup";

type LayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <FloatingButtons />
      <CounsellingPopup />
    </>
  );
}
