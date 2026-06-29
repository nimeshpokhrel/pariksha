"use client";

import { FaWhatsapp, FaFacebookMessenger } from "react-icons/fa";

export default function FloatingButtons() {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-center gap-3">
      <a
        href="https://m.me/355242947674886"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on Messenger"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0084FF] text-white shadow-lg transition-transform hover:scale-110"
      >
        <FaFacebookMessenger className="h-6 w-6" />
      </a>
      <a
        href="https://wa.me/9779761846971"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110"
      >
        <FaWhatsapp className="h-7 w-7" />
      </a>
    </div>
  );
}
