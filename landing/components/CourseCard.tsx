import { Book, FileQuestion, Video } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import HtmlContent from "./HtmlContent";
import Link from "next/link";
import UploadThingImage from "./UploadThingImage";

interface Course {
  _id: string;
  title: string;
  link: string;
  image: string;
  description: string;
  questionSetCount: number;
  subjectCount: number;
  videoCount: number;
}

export default function CourseCard({ course }: { course: Course }) {
  return (
    <>
      <Link href={`/courses/${course.link}`} className="h-full">
        <Card
          className={`group flex h-full transform flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:shadow-xl`}
        >
          <div className={`relative aspect-[1.91/1] w-full`}>
            <UploadThingImage
              imageLink={course.image}
              alt={course.title}
              fill
              className="object-contain transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
          </div>

          <CardContent className="flex-1 p-8 pt-4">
            <h2 className="mb-4 text-3xl font-bold">{course.title}</h2>
            <div className="mb-6 line-clamp-2 text-sm text-gray-600">
              <HtmlContent html={course.description} />
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-1">
                <Book className="h-5 w-5 text-green-500" />
                <span>{course.subjectCount} Subjects</span>
              </div>
              <div className="flex items-center gap-1">
                <FileQuestion className="h-5 w-5 text-purple-500" />
                <span>{course.questionSetCount} Question Sets</span>
              </div>
              <div className="flex items-center gap-1">
                <Video className="h-5 w-5 text-red-500" />
                <span>{course.videoCount} Video Lessons</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </>
  );
}
