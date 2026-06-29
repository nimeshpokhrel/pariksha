import { apiUrl, imageUrl } from "@/lib/config";
import Image from "next/image";
import {
  ArrowLeft,
  Clock,
  GraduationCap,
  LayoutGrid,
  School,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Link from "next/link";
import HtmlContent from "@/components/HtmlContent";
import { DegreeType } from "@/types/types";
import { CollegeCard } from "@/components/CollegeCard";
import { AeccCard } from "@/components/AeccCard";

export async function getStaticPaths() {
  const res = await fetch(`${apiUrl}/degree/getAllDegrees`);
  const degrees = await res.json();

  const paths = degrees.data.map((degree: DegreeType) => ({
    params: { link: degree.link },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { link: string } }) {
  const link = params.link.trim();
  const res = await fetch(`${apiUrl}/degree/getDegreeData/${link}`);

  const degree = await res.json();

  if (!degree) {
    return { notFound: true };
  }

  return {
    props: { degree: degree.data },
  };
}

export default function DegreePage({ degree }: { degree: DegreeType }) {
  const displayCollege = [
    ...degree.colleges.slice(0, 3),
    {
      _id: "aecc-global",
      name: "AECC Global",
      link: "/colleges/aecc",
      location: "Dillibazar, Kathmandu",
      logo: "/aecc/aecc-logo.png",
      coverImage: "/aecc/aecc-cover.jpg",
      foundedYear: "2008",
      degrees: [{ shortName: "AECC", sector: "67f13ad035b3268c35276e85" }] as [
        { shortName: string; sector: string },
      ],
      university: { name: "AECC Global" },
    },
    ...degree.colleges.slice(3),
  ];
  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[250px] w-full md:h-[400px] lg:h-[500px]">
        <Image
          src={`${imageUrl}/${degree.coverImage}` || "/placeholder.svg"}
          alt={`${degree.name}`}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute left-4 top-4 z-10">
          <Link href="/degrees">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Explore Other Degrees
            </Button>
          </Link>
        </div>
      </div>

      <div className="content-container relative z-10 mx-auto">
        <div className="relative z-10 -mt-16 mb-8 flex flex-col gap-4 rounded-2xl bg-white p-6 px-6 text-center shadow-md md:-mt-24 md:items-start md:text-left">
          <h1 className="mb-2 text-2xl font-bold md:text-4xl">
            {degree.name}
            <span className="ml-6">({degree.shortName})</span>
          </h1>
          <div className="ml-4 flex flex-col gap-4 text-sm md:flex-row">
            <div className="text-md flex items-center gap-1.5 text-muted-foreground">
              <div className="min-w-5">
                <School className="h-5 w-5" />
              </div>

              <Link
                href={`/universities/${degree.university.link}`}
                className="hover:underline"
              >
                {degree.university.name}
              </Link>
            </div>
            <div className="text-md flex items-center gap-1.5 text-muted-foreground">
              <div className="min-w-5">
                <LayoutGrid className="h-5 w-5" />
              </div>
              <Link
                href={`/sectors/${degree.sector.link}`}
                className="text-left hover:underline"
              >
                {degree.sector.name}
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-8 pl-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{degree.duration} Years</span>
            </div>
            <div className="flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4" />
              <span>{degree.semesterCount} Semesters</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="content-container-small mt-4 py-14 md:mt-8">
          <h2 className="relative mb-6 inline-block text-2xl font-bold">
            About the Degree
            <span className="absolute -bottom-2 left-0 h-1 w-1/3 rounded-full bg-primary"></span>
          </h2>
          <div className="text-justify-lg">
            <HtmlContent html={degree.description} />
          </div>
        </div>
        {degree.eligibilityCriteria &&
          degree.eligibilityCriteria.length > 0 && (
            <div className="bg-white pb-20 pt-16">
              <div className="content-container-small">
                <h2 className="relative mb-6 inline-block text-2xl font-bold text-primary">
                  Eligibility Criteria
                </h2>
                <div>
                  <ul className="list-disc pl-5 marker:text-secondary">
                    {degree.eligibilityCriteria.map((criteria) => (
                      <li key={criteria.title} className="mb-4">
                        <p className="text-xl font-semibold">
                          {criteria.title}
                        </p>
                        <p className="text-lg-justify mt-0.5 !text-lg">
                          {criteria.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        {degree.gradingSystem && degree.gradingSystem.length > 0 && (
          <div className="content-container-small py-14">
            <h2 className="relative mb-6 inline-block text-2xl font-bold text-primary">
              Grading System
            </h2>
            <p className="text-lg-justify mb-8">{degree.gradingTextUp}</p>

            {degree.gradingSystem && degree.gradingSystem.length > 0 && (
              <div className="flex w-full items-center justify-center">
                <Table className="m-auto w-max text-lg">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="border bg-orange px-2 text-center font-semibold text-white sm:w-48">
                        Letter Grade
                      </TableHead>
                      <TableHead className="border bg-orange px-2 text-center font-semibold text-white sm:w-48">
                        Grading Scale
                      </TableHead>
                      <TableHead className="border bg-orange px-2 text-center font-semibold text-white sm:w-48">
                        Grade Point
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {degree.gradingSystem?.map((grade) => (
                      <TableRow key={grade.letter}>
                        <TableCell className="border">{grade.letter}</TableCell>
                        <TableCell className="border">{grade.scale}</TableCell>
                        <TableCell className="border">{grade.point}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            <p className="text-lg-justify mt-8">{degree.gradingTextDown}</p>
          </div>
        )}
        {degree.courseStructure && degree.courseStructure.length > 0 && (
          <div className="bg-white">
            <div className="content-container-small py-14">
              <h2 className="relative mb-8 inline-block text-2xl font-bold text-primary">
                Course Structure
              </h2>

              {degree.courseStructure && degree.courseStructure.length > 0 && (
                <div className="grid grid-cols-1 gap-x-4 gap-y-8">
                  {degree.courseStructure.map((course) => (
                    <div key={course._id}>
                      <p className="mb-2 text-center text-lg font-semibold">
                        {course.title}
                      </p>
                      <Table className="text-lg">
                        <TableHeader>
                          <TableRow className="border-0">
                            <TableHead className="w-[150px] border-0 bg-orange px-2 font-bold text-white">
                              Course Code
                            </TableHead>
                            <TableHead className="border-0 bg-orange px-2 font-bold text-white">
                              Course Title
                            </TableHead>
                            <TableHead className="w-[170px] border-0 bg-orange px-2 font-bold text-white">
                              Course Marks
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {course.subjects?.map((subject) => (
                            <TableRow key={subject._id}>
                              <TableCell>{subject.code}</TableCell>
                              <TableCell>{subject.title}</TableCell>
                              <TableCell className="text-center">
                                {subject.marks}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="font-semibold">
                            <TableCell>Total</TableCell>
                            <TableCell></TableCell>
                            <TableCell className="text-center">
                              {course.subjects?.reduce(
                                (sum, subject) => sum + parseInt(subject.marks),
                                0,
                              )}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      {course.electives && course.electives.length > 0 && (
                        <div className="mt-3">
                          <p className="font-semibold">List of Electives :</p>
                          <ul className="list-disc pl-5">
                            {course.electives.map((elective) => (
                              <li key={elective} className="text-base">
                                {elective}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {displayCollege.length > 0 && (
        <div className="content-container py-14">
          <h2 className="relative mb-8 inline-block text-3xl font-bold">
            Partner Institutions
            <span className="absolute -bottom-2 left-0 h-1 w-1/3 rounded-full bg-primary"></span>
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayCollege.map((college, index) => (
              <div key={college._id + index}>
                {college._id === "aecc-global" ? (
                  <AeccCard />
                ) : (
                  <CollegeCard {...college} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
