import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#004A54] to-[#003842] pb-6 pt-12 text-white">
      <div className="content-container mx-auto px-6">
        <div className="mb-12">
          <div className="flex flex-col items-center justify-center rounded-lg border border-[#006D78]/20 bg-[#005F69]/40 p-8 text-center shadow-lg backdrop-blur-sm lg:flex-row lg:justify-between lg:text-left">
            <div className="mb-6 flex max-w-96 flex-col items-center gap-4 lg:items-start">
              <Link href="/" className="mr-0 inline-block">
                <Image
                  src="/LogoWhite.png"
                  alt="Pariksha Logo"
                  width={160}
                  height={80}
                />
              </Link>

              <p className="text-sm text-[#B8E8EE]">
                Prepare smarter, perform better, and progress toward your dream
                university with Pariksha.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 lg:justify-end">
              <Link
                href="mailto:info@pariksha.solutions"
                className="flex items-center rounded-md bg-[#006D78] px-4 py-2 shadow-sm transition-colors hover:bg-[#00828F]"
                target="_blank"
              >
                <Mail className="mr-2 h-4 w-4 text-[#B8E8EE]" />
                <span className="text-sm">info@pariksha.solutions</span>
              </Link>

              <Link
                href="tel:+9779761846971"
                className="flex items-center rounded-md bg-[#006D78] px-4 py-2 shadow-sm transition-colors hover:bg-[#00828F]"
                target="_blank"
              >
                <Phone className="mr-2 h-4 w-4 text-[#B8E8EE]" />
                <span className="text-sm">+977 9761846971</span>
              </Link>

              <Link
                href="https://www.google.com/maps/place/Pariksha/@27.6884784,85.3361201,17.79z/data=!4m15!1m8!3m7!1s0x39eb193b7a5f5de9:0x185a4d94e9e94a2!2sPariksha!8m2!3d27.6886791!4d85.3355243!10e5!16s%2Fg%2F11mdcb00fy!3m5!1s0x39eb193b7a5f5de9:0x185a4d94e9e94a2!8m2!3d27.6886791!4d85.3355243!16s%2Fg%2F11mdcb00fy?entry=ttu&g_ep=EgoyMDI1MDUxMS4wIKXMDSoASAFQAw%3D%3D"
                className="flex items-center rounded-md bg-[#006D78] px-4 py-2 shadow-sm transition-colors hover:bg-[#00828F]"
                target="_blank"
              >
                <MapPin className="mr-2 h-4 w-4 text-[#B8E8EE]" />
                <span className="text-sm">New Baneshwor</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-lg border border-[#006D78]/20 bg-[#005F69]/30 p-6 shadow-md">
            <h3 className="mb-4 text-lg font-bold text-[#F7A928]">
              Connect With Us
            </h3>
            <p className="mb-6 text-sm text-[#B8E8EE]">
              Follow us on social media to stay updated with the latest
              educational resources and opportunities.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/ParikshaSolutions"
                className="rounded-md bg-[#006D78] p-2 text-white shadow-sm transition-colors hover:bg-[#00828F]"
                target="_blank"
              >
                <FaFacebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://www.instagram.com/pariksha_solutions"
                className="rounded-md bg-[#006D78] p-2 text-white shadow-sm transition-colors hover:bg-[#00828F]"
                target="_blank"
              >
                <FaInstagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://www.tiktok.com/@parikshasolutions"
                className="rounded-md bg-[#006D78] p-2 text-white shadow-sm transition-colors hover:bg-[#00828F]"
                target="_blank"
              >
                <FaTiktok size={20} />
                <span className="sr-only">Tiktok</span>
              </Link>
              <Link
                href="mailto:info@pariksha.solutions"
                className="rounded-md bg-[#006D78] p-2 text-white shadow-sm transition-colors hover:bg-[#00828F]"
                target="_blank"
              >
                <Mail size={20} />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-[#006D78]/20 bg-[#005F69]/30 p-6 shadow-md">
            <h3 className="mb-4 text-lg font-bold text-[#F7A928]">Sitemap</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/universities"
                  className="text-[#B8E8EE] transition-colors hover:text-white"
                >
                  Universities
                </Link>
              </li>
              <li>
                <Link
                  href="/sectors"
                  className="text-[#B8E8EE] transition-colors hover:text-white"
                >
                  Sectors
                </Link>
              </li>
              <li>
                <Link
                  href="/degrees"
                  className="text-[#B8E8EE] transition-colors hover:text-white"
                >
                  Degrees
                </Link>
              </li>
              <li>
                <Link
                  href="/colleges"
                  className="text-[#B8E8EE] transition-colors hover:text-white"
                >
                  Colleges
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="text-[#B8E8EE] transition-colors hover:text-white"
                >
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-[#006D78]/20 bg-[#005F69]/30 p-6 shadow-md">
            <h3 className="mb-4 text-lg font-bold text-[#F7A928]">Courses</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/courses/csit-entrance`}
                  className="text-[#B8E8EE] transition-colors hover:text-white"
                >
                  BSc CSIT Entrance
                </Link>
              </li>
              <li>
                <Link
                  href="/courses/cmat"
                  className="text-[#B8E8EE] transition-colors hover:text-white"
                >
                  CMAT
                </Link>
              </li>
              <li>
                <Link
                  href="/courses/bca"
                  className="text-[#B8E8EE] transition-colors hover:text-white"
                >
                  BCA Entrance
                </Link>
              </li>
              <li>
                <Link
                  href="/courses/bit"
                  className="text-[#B8E8EE] transition-colors hover:text-white"
                >
                  BIT Entrance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[#006D78]/30 pt-6 text-center text-sm text-[#B8E8EE]">
          <p>
            ©{new Date().getFullYear()} Pariksha Solution Pvt. Ltd. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
