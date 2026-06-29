"use client";

import Link from "next/link";
import { useState } from "react";
import { RxCross1 } from "react-icons/rx";

export default function CollegeRecommendNavbar() {
  const [animateTop, setAnimateTop] = useState(false);
  const [show, setShow] = useState(true);
  return (
    <>
      {show && (
        <div
          className={`flex w-full ${animateTop && "translate-y-[-100%]"} transform justify-between gap-4 bg-primary px-8 py-4 text-white transition-transform duration-500`}
        >
          <p></p>
          <p className="text-semibold text-lg text-white">
            Find the perfect college for you !{" "}
            <Link href="/recommendation">
              <span className="font-semibold text-white underline">
                College Recommendation System
              </span>
            </Link>
          </p>
          <button
            className="text-white"
            onClick={() => {
              setAnimateTop(true);
              setTimeout(() => {
                setShow(false);
              }, 500);
            }}
          >
            <RxCross1 style={{ strokeWidth: "2" }} />
          </button>
        </div>
      )}
    </>
  );
}
