import { apiUrl, appLink } from "@/lib/config";
import { BookOpen, Clock, FileText, PlayCircle, TimerIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import UploadThingImage from "@/components/UploadThingImage";
import HtmlContent from "@/components/HtmlContent";
import { Badge } from "@/components/ui/badge";
import SubjectDrawer from "@/components/SubjectDrawer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Course } from "@/types/types";
import Link from "next/link";

export async function getStaticPaths() {
  const res = await fetch(`${apiUrl}/course/getAllCourses`);
  const courses = await res.json();

  const paths = courses.data.map((course: Course) => ({
    params: { link: course.link },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { link: string } }) {
  const link = params.link.trim();
  const res = await fetch(`${apiUrl}/course/getCourseData/${link}`);

  const course = await res.json();

  if (!course) {
    return { notFound: true };
  }

  return {
    props: { course: course.data },
  };
}

export default function CoursePage({ course }: { course: Course }) {
  let count = 0;

  return (
    <div className="min-h-screen bg-background pb-8 pt-8">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-12 overflow-hidden rounded-2xl border border-primary-10 bg-white shadow-sm">
          <div className="flex flex-col items-start p-0">
            <div className="relative aspect-[1.91/1] max-h-80 w-full overflow-hidden">
              <UploadThingImage
                imageLink={course.image}
                alt={course.title}
                width={1200}
                height={300}
                className="h-full w-full object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="p-8">
              <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                {course.title}
              </h1>
              <div className="mb-8 text-gray-600 md:text-justify md:text-lg">
                <HtmlContent html={course.description} />
              </div>
              <div className="mb-10 flex flex-wrap gap-3">
                <Badge className="bg-primary-10 px-3 py-1 text-primary">
                  <BookOpen className="mr-1 h-4 w-4" />
                  {course.subjectCount} Subjects
                </Badge>
                <Badge className="bg-primary-10 px-3 py-1 text-primary">
                  <PlayCircle className="mr-1 h-4 w-4" />
                  {course.videoCount} Video Lessons
                </Badge>
                <Badge className="bg-primary-10 px-3 py-1 text-primary">
                  <FileText className="mr-1 h-4 w-4" />
                  {course.questionSetCount} Question Sets
                </Badge>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`${appLink}/courses/${course.link}`}
                  target="_blank"
                >
                  <Button className="hover:bg-primary-95">Go To Course</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <section>
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Video Content</h2>
            <div className="text-sm text-gray-500">
              {course.subjectCount} Subjects • {course.videoCount} Videos
            </div>
          </div>

          <div>
            <Accordion type="multiple" className="w-full space-y-6">
              {course.subjects.map((subject) => {
                if (subject.videoCount > 0) count++;
                return (
                  subject.videoCount > 0 && (
                    <AccordionItem
                      key={subject._id}
                      value={subject._id}
                      className="rounded-xl border border-gray-100 bg-white px-8 shadow-sm"
                    >
                      <AccordionTrigger className=" ">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-10 text-lg font-semibold text-primary">
                            {count}
                          </div>
                          <div>
                            <h3 className="mb-1 text-lg font-semibold">
                              {subject.title}
                            </h3>
                            <div className="flex flex-wrap gap-3">
                              <Badge className="bg-primary-10 px-3 py-1 text-primary">
                                <PlayCircle className="mr-1 h-3 w-3" />
                                {subject.videoCount}
                              </Badge>
                              <Badge className="bg-primary-10 px-3 py-1 text-primary">
                                <TimerIcon className="mr-1 h-3 w-3" />
                                {subject.duration}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="mt-4">
                        <SubjectDrawer
                          subjectData={subject}
                          courseLink={course.link}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  )
                );
              })}
            </Accordion>
          </div>
        </section>

        {/* Question Sets Section */}
        <section className="mt-20 grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Past Question Sets
            </h2>
            <div className="space-y-4">
              {course.questionSets
                .filter((set) => set.setType === "past")
                .map((set) => (
                  <div
                    key={set._id}
                    className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{set.title}</h3>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <FileText className="mr-1 h-4 w-4" />
                          <span>{set.questionCount} questions</span>

                          <Clock className="ml-4 mr-1 h-4 w-4" />
                          <span> {set.duration || 120} min</span>
                        </div>
                      </div>
                      <Link
                        href={`${appLink}/courses/${course.link}/tests/${set.link}`}
                        target="_blank"
                      >
                        <Button>Start</Button>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Model Question Sets
            </h2>
            <div className="space-y-4">
              {course.questionSets
                .filter((set) => set.setType === "mock")
                .map((set) => (
                  <div
                    key={set._id}
                    className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{set.title}</h3>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <FileText className="mr-1 h-4 w-4" />
                          <span>{set.questionCount} questions</span>

                          <Clock className="ml-4 mr-1 h-4 w-4" />
                          <span> {set.duration || 120} min</span>
                        </div>
                      </div>
                      <Link
                        href={`${appLink}/courses/${course.link}/tests/${set.link}`}
                        target="_blank"
                      >
                        <Button>Start</Button>
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
