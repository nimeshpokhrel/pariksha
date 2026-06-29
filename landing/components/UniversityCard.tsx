import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users } from "lucide-react";
import Link from "next/link";
import { UniversityCardType } from "@/types/types";
import UploadThingImage from "./UploadThingImage";

export function UniversityCard({
  name,
  location,
  coverImage,
  logo,
  students,
  ownership,
  link,
}: UniversityCardType) {
  return (
    <Card className="group h-full cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg">
      <Link href={`/universities/${link}`} className="flex h-full flex-col">
        <div className="relative h-48 w-full">
          <UploadThingImage
            imageLink={coverImage}
            alt={`${name}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        <CardContent className="relative flex flex-1 flex-col pb-4 pt-12">
          <div className="absolute -top-8 left-4">
            <div className="relative h-16 w-16 overflow-hidden rounded-xl border-4 border-background bg-white shadow-lg">
              <UploadThingImage
                imageLink={logo}
                alt={`${name} logo`}
                className="object-contain"
                fill
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between space-y-3">
            <div>
              <h3 className="text-lg font-semibold">{name}</h3>
              <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="line-clamp-1">{location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t pt-2">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{students.toLocaleString()} students</span>
              </div>
              <Badge variant={"default"}>{ownership}</Badge>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
