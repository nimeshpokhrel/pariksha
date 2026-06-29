"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  const pathname = usePathname();

  const hideFooter =
    /^\/courses\/[^/]+\/videos\/[^/]+\/[^/]+$/.test(pathname) || // course video route
    pathname.startsWith("/login");

  if (hideFooter) return null;
  return (
    <footer className="mt-12 bg-gradient-to-b from-[#004A54] to-[#003842] py-6 text-white">
      <div className="content-container mx-auto px-6">
        <div className="flex flex-col items-center justify-center gap-8 lg:flex-row lg:justify-between lg:text-left">
          <Link href="/" className="mr-0 inline-block">
            <Image
              src="/logo/LogoWhite.png"
              alt="Pariksha Logo"
              width={240}
              height={80}
            />
          </Link>

          <div className="flex flex-wrap justify-center gap-4 lg:justify-end">
            <Link
              href="https://wa.me/9761846971"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center rounded-md bg-[#006D78] px-4 py-2 shadow-sm transition-colors hover:bg-[#00828F]"
            >
              <FaWhatsapp className="mr-2 h-4 w-4 text-[#B8E8EE]" />
              <span className="text-sm">+977 9761846971</span>
            </Link>

            <Link
              href="https://www.facebook.com/ParikshaSolutions"
              className="flex items-center rounded-md bg-[#006D78] px-4 py-2 shadow-sm transition-colors hover:bg-[#00828F]"
              target="_blank"
            >
              <FaFacebookF className="mr-2 h-4 w-4 text-[#B8E8EE]" />
              <span className="text-sm">Facebook</span>
            </Link>

            <Link
              href="https://www.google.com/maps/place/Pariksha/@27.6884784,85.3361201,17.79z/data=!4m15!1m8!3m7!1s0x39eb193b7a5f5de9:0x185a4d94e9e94a2!2sPariksha!8m2!3d27.6886791!4d85.3355243!10e5!16s%2Fg%2F11mdcb00fy!3m5!1s0x39eb193b7a5f5de9:0x185a4d94e9e94a2!8m2!3d27.6886791!4d85.3355243!16s%2Fg%2F11mdcb00fy?entry=ttu&g_ep=EgoyMDI1MDUxMS4wIKXMDSoASAFQAw%3D%3D"
              className="hidden items-center rounded-md bg-[#006D78] px-4 py-2 shadow-sm transition-colors hover:bg-[#00828F] sm:flex"
              target="_blank"
            >
              <MapPin className="mr-2 h-4 w-4 text-[#B8E8EE]" />
              <span className="text-sm">New Baneshwor</span>
            </Link>
          </div>
        </div>

        <div className="mt-6 border-t border-[#006D78]/30 pt-6 text-center text-sm text-[#B8E8EE]">
          <p>
            ©{new Date().getFullYear()} Pariksha Solution Pvt. Ltd. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
