import Link from "next/link";
import { MapPin, GraduationCap, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import UploadThingImage from "./UploadThingImage";
import { CollegeCardType } from "@/types/types";

export function CollegeCard({
  name,
  link,
  logo,
  coverImage,
  location,
  foundedYear,
  degrees,
  university,
  featured = false,
  className,
}: CollegeCardType) {
  const displayPrograms = degrees.slice(0, 3);
  const hasMorePrograms = degrees.length > 3;

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
        featured && "ring-orange-500 ring-2 ring-offset-2",
        className,
      )}
    >
      <Link href={`/colleges/${link}`} className="flex h-full flex-col">
        {featured && (
          <div className="absolute right-0 top-0 z-10">
            <Badge className="bg-orange-500 rounded-bl-md rounded-br-none rounded-tl-none rounded-tr-md px-2 py-0.5 text-xs font-medium text-white">
              Featured
            </Badge>
          </div>
        )}

        {/* Cover Image */}
        <div className="relative aspect-[1.91/1] w-full overflow-hidden bg-gray-100">
          <UploadThingImage
            imageLink={coverImage}
            alt={`${name}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Logo and Content */}
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start">
            {/* Logo */}
            <div className="relative mr-3 h-16 w-16 overflow-hidden rounded-md border bg-white p-1 shadow-sm">
              <UploadThingImage
                imageLink={logo}
                alt={`${name} logo`}
                fill
                className="object-contain"
              />
            </div>

            {/* College Name and Location */}
            <div className="flex-1">
              <h3 className="line-clamp-2 font-bold text-gray-900">{name}</h3>
              <div className="mt-1 flex items-center text-xs text-gray-500">
                <MapPin className="mr-1 h-3 w-3" />
                <span className="line-clamp-1">{location}</span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="mt-4 space-y-2 text-sm">
            {/* FoundedYear */}
            <div className="flex items-center text-gray-600">
              <Calendar className="mr-2 h-4 w-4 text-gray-400" />
              <span>Established: {foundedYear}</span>
            </div>

            {/* Affiliation */}
            {university && (
              <div className="flex items-center text-gray-600">
                <GraduationCap className="mr-2 h-4 w-4 text-gray-400" />
                <span className="line-clamp-1">
                  Affiliated to: {university.name}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t p-3">
          <div className="flex flex-wrap gap-1.5">
            {displayPrograms.map((program) => (
              <Badge
                key={program.shortName}
                variant="outline"
                className={`${getProgramColors(program.sector).bg} ${getProgramColors(program.sector).text}`}
              >
                {program.shortName}
              </Badge>
            ))}
            {hasMorePrograms && (
              <Badge
                variant="outline"
                className="border-gray-200 bg-gray-50 text-xs text-gray-600"
              >
                +{degrees.length - 3} more
              </Badge>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
