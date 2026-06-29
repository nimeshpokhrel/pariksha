import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FaStar } from "react-icons/fa";

import { cn } from "@/lib/utils";

import Image from "next/image";

export function AeccCard() {
  //   const displayPrograms = degrees.slice(0, 3);
  //   const hasMorePrograms = degrees.length > 3;

  const getProgramColors = (sector: string) => {
    switch (sector.toLowerCase()) {
      case "67f13ad035b3268c35276e85":
        return { bg: "bg-blue-50", text: "text-blue-700" };
      case "67f3a5bdb8391cbc11e49b02":
        return { bg: "bg-purple-50", text: "text-purple-700" };
      case "67f5d156a2b6565de36b58f9":
        return { bg: "bg-emerald-50", text: "text-emerald-700" };
      case "67f5d38da2b6565de36b5b07":
        return { bg: "bg-red-50", text: "text-red-700" };
      case "67f5d709a2b6565de36b5e07":
        return { bg: "bg-indigo-50", text: "text-indigo-700" };
      case "67f5e24d6766d39a1a225ccd":
        return { bg: "bg-amber-50", text: "text-amber-700" };
      default:
        return { bg: "bg-gray-50", text: "text-gray-700" };
    }
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-lg",
      )}
    >
      <Link href={`/colleges/aecc`} className="flex h-full flex-col">
        <div className="absolute right-2 top-2 z-10">
          <FaStar className="h-5 w-5 text-amber-400" />
        </div>

        {/* Cover Image */}
        <div className="relative aspect-[1.91/1] w-full overflow-hidden bg-gray-100">
          <Image
            src={"/aecc/aecc-cover.png"}
            alt={`AECC GLOBAL`}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Logo and Content */}
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start">
            <div className="relative mr-3 h-16 w-16 overflow-hidden rounded-md border bg-white p-1 shadow-sm">
              <Image
                src={"/aecc/aecc-logo.png"}
                alt={`AECC GLOBAL`}
                fill
                className="object-contain px-1"
              />
            </div>

            {/* College Name and Location */}
            <div className="flex-1">
              <h3 className="line-clamp-2 font-bold text-gray-900">
                AECC GLOBAL
              </h3>
              <div className="mt-1 flex items-center text-xs text-gray-500">
                <MapPin className="mr-1 h-3 w-3" />
                <span className="line-clamp-1">Dillibazar, Kathmandu</span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="mt-4 space-y-2 text-sm">
            {/* FoundedYear */}
            <div className="flex items-center text-gray-600">
              <Calendar className="mr-2 h-4 w-4 text-gray-400" />
              <span>Established: 2008</span>
            </div>

            {/* Affiliation */}
            {/* {university && (
              <div className="flex items-center text-gray-600">
                <GraduationCap className="mr-2 h-4 w-4 text-gray-400" />
                <span className="line-clamp-1">
                  Affiliated to: {university.name}
                </span>
              </div>
            )} */}
          </div>
        </div>

        <div className="flex items-center justify-between border-t p-3">
          <div className="flex flex-wrap gap-1.5">
            {[
              { name: "Australia", sector: "67f5d156a2b6565de36b58f9" },
              { name: "UK", sector: "67f5e24d6766d39a1a225ccd" },
              { name: "USA", sector: "67f5d709a2b6565de36b5e07" },
              { name: "Canada", sector: "67f13ad035b3268c35276e85" },
              { name: "New Zealand", sector: "67f5d38da2b6565de36b5b07" },
            ].map((program) => (
              <Badge
                key={program.name}
                variant="outline"
                className={`${getProgramColors(program.sector).bg} ${getProgramColors(program.sector).text}`}
              >
                {program.name}
              </Badge>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}
