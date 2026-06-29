import Hero from "@/components/homePage/Hero";
import { FeatureSection } from "@/components/homePage/FeatureSection";
import Image from "next/image";
import Faq from "@/components/Faq";
import { apiUrl } from "@/lib/config";
import { UniversityCard } from "@/components/UniversityCard";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { SectorCard } from "@/components/SectorCard";
import { DegreeCard } from "@/components/DegreeCard";
import { CollegeCard } from "@/components/CollegeCard";
import CourseCard from "@/components/CourseCard";
import Testimonials from "@/components/homePage/Testimonials";
import {
  CollegeCardType,
  DegreeCardType,
  SectorCardType,
  UniversityCardType,
} from "@/types/types";
import { BlogCard } from "@/components/BlogCard";

const faqItems = [
  {
    question: "What is Pariksha?",
    answer:
      "Pariksha is a free online and offline platform that helps students in Nepal prepare for university entrance exams by providing curated study materials, mock tests, and live support.",
  },
  // ... rest of FAQ items
];

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

interface Blog {
  _id: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  readTime: number;
  blogImagePublicId: string;
  blogImageUrl: string;
  createdAt: Date;
}

export default function Home({
  universities,
  sectors,
  degrees,
  colleges,
  courses,
  blogs,
}: {
  universities: UniversityCardType[];
  sectors: SectorCardType[];
  degrees: DegreeCardType[];
  colleges: CollegeCardType[];
  courses: Course[];
  blogs: Blog[];
}) {
  const allData = [
    ...universities.map((university) => ({
      _id: university._id,
      name: university.name,
      link: university.link,
      category: "University" as const,
    })),
    ...sectors.map((sector) => ({
      _id: sector._id,
      name: sector.name,
      link: sector.link,
      category: "Sector" as const,
    })),
    ...degrees.map((degree) => ({
      _id: degree._id,
      name: `${degree.name} (${degree.shortName}) - ${degree.university.name}`,
      link: degree.link,
      category: "Degree" as const,
    })),
    ...colleges.map((college) => ({
      _id: college._id,
      name: college.name,
      link: college.link,
      category: "College" as const,
    })),
  ];

  return (
    <div>
      <Hero data={allData} />
      <div className="bg-background">
        <div className="content-container max-[1200px]:px-1 pb-12 pt-8 lg:pb-20">
          <FeatureSection />
        </div>
      </div>
      {/* Courses Section */}
      <div className="bg-white pt-8">
        <div className="content-container max-[1200px]:px-1 pb-20">
          <h2 className="mb-0.5 text-center text-4xl font-bold text-primary">
            Courses
          </h2>
          <p className="mb-12 text-center font-normal text-foreground">
            Courses That We Currently Offer
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {courses && courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </div>
      </div>
      {/* Universities */}
      <div className="bg-background pt-8">
        <div className="content-container pb-20">
          <div className="mb-8 flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-center md:text-left">
              <h2 className="mb-1 text-4xl font-bold text-primary">Universities</h2>
              <p className="font-normal text-foreground">
                Universities currently offering courses in Nepal
              </p>
            </div>
            <Link href="/universities">
              <Button variant="outline" className="w-max border-primary bg-white px-10 py-6 text-primary transition-colors hover:bg-primary hover:text-white">
                Explore All Universities <ArrowRightIcon className="ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {universities.slice(0, 3).map((university) => (
              <UniversityCard key={university._id} {...university} />
            ))}
          </div>
        </div>
      </div>
      {/* Sectors */}
      <div className="bg-white pt-8">
        <div className="content-container pb-20">
          <div className="mb-8 flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-center md:text-left">
              <h2 className="mb-1 text-4xl font-bold text-primary">Sectors</h2>
              <p className="font-normal text-foreground">Sectors currently in Nepal</p>
            </div>
            <Link href="/sectors">
              <Button variant="outline" className="w-max border-primary px-10 py-6 text-primary transition-colors hover:bg-primary hover:text-white">
                Explore All Sectors <ArrowRightIcon className="ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sectors.slice(0, 3).map((sector) => (
              <SectorCard key={sector._id} {...sector} />
            ))}
          </div>
        </div>
      </div>
      {/* Degrees */}
      <div className="bg-background pt-8">
        <div className="content-container pb-20">
          <div className="mb-8 flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-center md:text-left">
              <h2 className="mb-1 text-4xl font-bold text-primary">Degrees</h2>
              <p className="font-normal text-foreground">Degrees currently taught in Nepal</p>
            </div>
            <Link href="/degrees">
              <Button variant="outline" className="w-max border-primary bg-white px-10 py-6 text-primary transition-colors hover:bg-primary hover:text-white">
                Explore All Degrees <ArrowRightIcon className="ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {degrees.slice(0, 3).map((degree) => (
              <DegreeCard key={degree._id} {...degree} />
            ))}
          </div>
        </div>
      </div>
      {/* Partner Colleges */}
      <div className="bg-white pt-8">
        <div className="content-container pb-20">
          <div className="mb-8 flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-center md:text-left">
              <h2 className="mb-1 text-4xl font-bold text-primary">Partner Colleges</h2>
              <p className="font-normal text-foreground">Explore Our Partner Colleges</p>
            </div>
            <Link href="/colleges">
              <Button variant="outline" className="w-max border-primary bg-white px-10 py-6 text-primary transition-colors hover:bg-primary hover:text-white">
                Explore Colleges <ArrowRightIcon className="ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {colleges.slice(0, 3).map((college) => (
              <CollegeCard key={college._id} {...college} />
            ))}
          </div>
        </div>
      </div>
      {/* Testimonials */}
      <div className="bg-background pb-14 pt-8">
        <div className="content-container">
          <h2 className="mb-0.5 text-center text-4xl font-bold text-primary">Testimonials</h2>
          <p className="mb-12 text-center font-normal text-foreground">What Our Students Say</p>
          <Testimonials />
        </div>
      </div>
      {/* Blogs */}
      <div className="bg-background pt-8">
        <div className="content-container pb-20">
          <div className="mb-8 flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-center md:text-left">
              <h2 className="mb-1 text-4xl font-bold text-primary">Blogs</h2>
              <p className="font-normal text-foreground">Stay Updated with Our Latest Blogs and Articles</p>
            </div>
            <Link href="/blogs">
              <Button variant="outline" className="w-max border-primary bg-white px-10 py-6 text-primary transition-colors hover:bg-primary hover:text-white">
                Explore Blogs <ArrowRightIcon className="ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {blogs.slice(0, 3).map((blog) => (
              <BlogCard key={blog._id} {...blog} />
            ))}
          </div>
        </div>
      </div>
      {/* FAQ */}
      <div className="bg-white pb-10 pt-8">
        <div className="content-container flex flex-col items-center justify-center">
          <h2 className="mb-0.5 text-center text-4xl font-bold text-primary">FAQ</h2>
          <p className="mb-12 text-center font-normal text-foreground">Have Questions? We've Got Answers</p>
          <div className="flex w-full justify-center gap-20">
            <div className="w-full max-w-xl">
              <Faq faqItems={faqItems} type="multiple" />
            </div>
            <Image src="/images/faq-image.png" alt="FAQ" width={200} height={235} className="hidden max-h-[235px] md:block" />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const [
      universitiesRes,
      sectorsRes,
      degreesRes,
      collegesRes,
      coursesRes,
      blogsRes,
    ] = await Promise.all([
      fetch(`${apiUrl}/university/getAllUniversities`),
      fetch(`${apiUrl}/sector/getAllSectors`),
      fetch(`${apiUrl}/degree/getAllDegrees`),
      fetch(`${apiUrl}/college/getAllColleges`),
      fetch(`${apiUrl}/course/getAllCourses`),
      fetch(`${apiUrl}/blog`),
    ]);

    if (!universitiesRes.ok || !sectorsRes.ok || !degreesRes.ok || !collegesRes.ok || !coursesRes.ok || !blogsRes.ok) {
      throw new Error("Failed to fetch one or more resources");
    }

    const [universities, sectors, degrees, colleges, courses, blogs] =
      await Promise.all([
        universitiesRes.json(),
        sectorsRes.json(),
        degreesRes.json(),
        collegesRes.json(),
        coursesRes.json(),
        blogsRes.json(),
      ]);

    return {
      props: {
        universities: universities.data,
        sectors: sectors.data,
        degrees: degrees.data,
        colleges: colleges.data,
        courses: courses.data,
        blogs: blogs.blogs,
      },
    };
  } catch (error) {
    console.error("Error fetching home page data:", error);
    return {
      props: {
        universities: [],
        sectors: [],
        degrees: [],
        colleges: [],
        courses: [],
        blogs: [],
      },
    };
  }
}
