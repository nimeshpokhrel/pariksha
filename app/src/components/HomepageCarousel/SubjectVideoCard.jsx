import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import UploadThingImage from "../UploadThingImage";

export default function SubjectVideoCard({
  link,
  imageSrc,
  title,
  infoItems,
  sections,
}) {
  return (
    <div className="h-full">
      <Link href={link}>
        <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
          <div className="relative aspect-[1.91/1] w-full">
            <div className="absolute inset-0 z-0"></div>
            <UploadThingImage
              src={imageSrc}
              alt={title}
              fill
              className="object-cover transition-all hover:scale-105"
            />
          </div>
          <CardContent className="pt-4">
            <h3 className="mb-2 text-lg font-semibold">{title}</h3>
            <div className="flex gap-4 text-sm">
              {infoItems.map((infoItem, index) => (
                <span
                  key={index}
                  className={`flex items-center gap-1 pr-4 ${index !== infoItems.length - 1 ? "border-r-2 border-solid border-primary" : ""}`}
                >
                  {infoItem.icon ? infoItem.icon : null}
                  {infoItem.text}
                </span>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {sections && sections.length > 0 && (
                <>
                  {sections.slice(0, 3).map((section) => (
                    <Badge
                      key={section.title}
                      variant="outline"
                      className="rounded-xl bg-slate-50 py-1"
                    >
                      {section.title}
                    </Badge>
                  ))}
                  {sections.length > 3 && (
                    <Badge
                      variant="outline"
                      className="rounded-xl bg-green-100 py-1 text-green-800"
                    >
                      +{sections.length - 3}
                    </Badge>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
