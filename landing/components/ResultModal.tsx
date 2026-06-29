"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const ResultModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="relative w-11/12 max-w-lg rounded-2xl bg-white p-8 text-center shadow-2xl">
        <button
          className="absolute right-4 top-4 text-2xl font-bold text-gray-400 hover:text-gray-800"
          onClick={() => setIsVisible(false)}
        >
          ×
        </button>

        <h2 className="mb-4 text-3xl font-bold text-primary">
          Entrance 2025 Result Published!
        </h2>

        <p className="mb-8 leading-6 text-gray-700">
          The Bachelor of Computer Application and Bachelor of Science in
          Computer Science and Information Technology entrance exam results are
          now available. Click below to view your results.
        </p>

        <Link
          href="/entrance-result"
          onClick={() => setIsVisible(false)}
          className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.03]"
        >
          View Result
        </Link>
      </div>
    </div>
  );
};

export default ResultModal;
