import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import UploadThingImage from "./UploadThingImage";
import HtmlContent from "./HtmlContent";
import { SectorCardType } from "@/types/types";

export function SectorCard({
  name,
  coverImage,
  degreesCount,
  description,
  link,
}: SectorCardType) {
  return (
    <Card className="group relative h-full cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg">
      <Link href={`/sectors/${link}`} className="flex h-full flex-col">
        <div className="absolute right-2 top-2 z-[1] flex flex-wrap items-center gap-1.5">
          {/* <span className="rounded-md bg-primary px-2 py-1 text-xs text-white">
            {areasOfStudy[0].title}
          </span> */}
        </div>
        <div className="relative h-48 w-full">
          <UploadThingImage
            imageLink={coverImage}
            alt={`${name}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <CardContent className="relative flex flex-1 flex-col pb-4 pt-2">
          <div className="flex flex-1 flex-col justify-between space-y-4">
            <div className="flex h-full flex-col justify-between">
              <h3 className="text-xl font-semibold">{name}</h3>
              <div className="mt-4 line-clamp-2 text-sm text-muted-foreground">
                <HtmlContent html={description} />
              </div>
            </div>

            <div className="flex items-center justify-between border-t pt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4" />
                <span>{degreesCount}+ degrees</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
