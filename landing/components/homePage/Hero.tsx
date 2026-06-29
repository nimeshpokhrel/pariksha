import React from "react";
import Image from "next/image";
import { SearchBar } from "./homePageSearch/SearchBar";
import type { SearchResult } from "@/types/types";
import { TypewriterEffectSequential } from "../ui/typewriter-effect";
// import { HeroParallax } from "./ui/hero-parallax";

export const products = [
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/moonbeam.png",
  },
  {
    title: "Cursor",
    link: "https://cursor.so",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/cursor.png",
  },
  {
    title: "Rogue",
    link: "https://userogue.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/rogue.png",
  },

  {
    title: "Editorially",
    link: "https://editorially.org",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/editorially.png",
  },
  {
    title: "Editrix AI",
    link: "https://editrix.ai",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/editrix.png",
  },
  {
    title: "Pixel Perfect",
    link: "https://app.pixelperfect.quest",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/pixelperfect.png",
  },

  {
    title: "Algochurn",
    link: "https://algochurn.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/algochurn.png",
  },
  {
    title: "Aceternity UI",
    link: "https://ui.aceternity.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/aceternityui.png",
  },
  {
    title: "Tailwind Master Kit",
    link: "https://tailwindmasterkit.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/tailwindmasterkit.png",
  },
  {
    title: "SmartBridge",
    link: "https://smartbridgetech.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/smartbridge.png",
  },
  {
    title: "Renderwork Studio",
    link: "https://renderwork.studio",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/renderwork.png",
  },

  {
    title: "Creme Digital",
    link: "https://cremedigital.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/cremedigital.png",
  },
  {
    title: "Golden Bells Academy",
    link: "https://goldenbellsacademy.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/goldenbellsacademy.png",
  },
  {
    title: "Invoker Labs",
    link: "https://invoker.lol",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/invoker.png",
  },
  {
    title: "E Free Invoice",
    link: "https://efreeinvoice.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/efreeinvoice.png",
  },
];

export default function Hero({ data }: { data: SearchResult[] }) {
  return (
    <div className="relative">
      <div className="content-container relative flex flex-col items-center justify-center py-20 pl-4 md:min-h-[80vh]">
        <div className="relative max-w-[700px]">
          <div className="text-center text-white">
            <div className="mb-6">
              <h2 className="inline-flex items-center font-medium text-[#FEA602] md:text-lg max-xs:text-sm">
                Prep, Perform, Progress
                <span className="mx-2 h-px w-5 bg-[#FEA602] max-xs:w-4"></span>
                with Pariksha!
              </h2>
            </div>
            <h1 className="mb-10 text-2xl font-bold md:text-5xl">
              Free Entrance Preparation
              <div className="mt-4 h-6 md:h-12">
                <TypewriterEffectSequential
                  phrases={[
                    { text: "BSc. CSIT" },
                    { text: "CMAT" },
                    { text: "BCA" },
                    { text: "BIT" },
                  ]}
                  textColor="text-[#FEA602] text-4xl font-bold md:text-6xl"
                  cursorColor="bg-primary"
                />
              </div>
            </h1>

            <p className="mb-6 text-base opacity-90 md:text-lg">
              Prepare smarter, perform better, and progress toward your dream
              university with Pariksha. Our free, expert-led resources give you
              everything you need to succeed in entrance exams—anytime,
              anywhere.
            </p>
          </div>
          <div className="w-full text-white">
            <SearchBar allData={data} />
          </div>
        </div>
      </div>

      <Image
        src={"/images/background.jpg"}
        alt="Hero background"
        fill
        priority
        className="z-[-1] object-cover object-center"
      />

      <div className="absolute inset-0 z-[-1] bg-black/70" />
    </div>
  );
}
