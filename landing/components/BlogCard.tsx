import Link from "next/link";
import { Calendar, BookOpenCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BlogCardType } from "@/types/types";
import Image from "next/image";

export function BlogCard({
  _id,
  title,
  description,
  readTime,
  tags,
  blogImageUrl,
  createdAt,
}: BlogCardType) {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-lg",
      )}
    >
      <Link href={`/blogs/${_id}`} className="flex h-full flex-col">
        {/* Cover Image */}
        <div className="relative aspect-[1.91/1] w-full overflow-hidden bg-gray-100">
          <Image
            src={blogImageUrl}
            alt={`${title} cover image`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Logo and Content */}
        <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start">
            {/* College Name and Location */}
            <div className="flex-1">
              <h3 className="line-clamp-2 font-bold text-gray-900">{title}</h3>
              <h3 className="mt-1 line-clamp-2 text-sm text-gray-900">
                {description}
              </h3>
            </div>
          </div>

          {/* Details */}
          <div className="mt-4 space-y-2 text-sm">
            {/* FoundedYear */}
            <div className="flex items-center text-gray-600">
              <BookOpenCheck className="mr-2 h-4 w-4 text-gray-400" />
              <span>{readTime} mins</span>
            </div>

            {/* Affiliation */}
            <div className="flex items-center text-gray-600">
              <Calendar className="mr-2 h-4 w-4 text-gray-400" />
              <span className="line-clamp-1">
                {new Date(createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t p-3">
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                // className={`${getProgramColors(program.sector).bg} ${getProgramColors(program.sector).text}`}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}
