import { apiUrl, imageUrl } from "@/lib/config";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  GraduationCap,
  Landmark,
  MapPin,
  School,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import HtmlContent from "@/components/HtmlContent";
import { DegreeCard } from "@/components/DegreeCard";
import { UniversityType } from "@/types/types";
import { CollegeCard } from "@/components/CollegeCard";
import Faq from "@/components/Faq";
import CarouselContainer from "@/components/CarousalContainer";
import { AeccCard } from "@/components/AeccCard";

export async function getStaticPaths() {
  const res = await fetch(`${apiUrl}/university/getAllUniversities`);
  const universities = await res.json();

  const paths = universities.data.map((university: UniversityType) => ({
    params: { link: university.link },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { link: string } }) {
  const link = params.link.trim();
  const res = await fetch(`${apiUrl}/university/getUniversityData/${link}`);

  const university = await res.json();

  if (!university) {
    return { notFound: true };
  }

  return {
    props: { university: university.data },
  };
}

export default function UniversityPage({
  university,
}: {
  university: UniversityType;
}) {
  const faqItems = [
    {
      question: `When was ${university.name} established?`,
      answer: `The ${university.name} was established in ${university.foundedYear}`,
    },
    {
      question: `Where is ${university.name} located?`,
      answer: `The ${university.name} is located in ${university.location}`,
    },

    ...(university.faqs || []),
  ];

  const displayCollege = [
    ...university.colleges.slice(0, 3),
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
    ...university.colleges.slice(3),
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[250px] w-full md:h-[400px] lg:h-[500px]">
        <Image
          src={`${imageUrl}/${university.coverImage}` || "/placeholder.svg"}
          alt={`${university.name}`}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute left-4 top-4 z-10">
          <Link href="/universities">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Explore Other Universities
            </Button>
          </Link>
        </div>
      </div>

      <div className="content-container relative z-10 mx-auto">
        <div className="relative z-10 -mt-16 mb-8 rounded-2xl bg-white p-6 shadow-md md:-mt-24">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden md:h-32 md:w-32">
              <Image
                src={`${imageUrl}/${university.logo}` || "/placeholder.svg"}
                alt={`${university.name} logo`}
                layout="fill"
                objectFit="contain"
              />
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold md:text-4xl">
                {university.name}
              </h1>
              <div className="mt-2 flex items-center justify-center text-muted-foreground md:justify-start">
                <MapPin className="mr-1 h-4 w-4" />
                <span>{university.location}</span>
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-3 md:justify-start">
                <div className="flex items-center rounded-full bg-slate-50 px-3 py-1.5">
                  <Landmark className="mr-1.5 h-4 w-4 text-primary" />
                  <span className="text-sm">{university.ownership}</span>
                </div>
                <div className="flex items-center rounded-full bg-slate-50 px-3 py-1.5">
                  <GraduationCap className="mr-1.5 h-4 w-4 text-primary" />
                  <span className="text-sm">{university.students}</span>
                </div>
                <div className="flex items-center rounded-full bg-slate-50 px-3 py-1.5">
                  <School className="mr-1.5 h-4 w-4 text-primary" />
                  <span className="text-sm">{university.establishments}</span>
                </div>
                <div className="flex items-center rounded-full bg-slate-50 px-3 py-1.5">
                  <Calendar className="mr-1.5 h-4 w-4 text-primary" />
                  <span className="text-sm">Est. {university.foundedYear}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-container-small pb-8">
        <div className="mt-4 md:mt-8">
          <h2 className="relative mb-8 inline-block text-3xl font-bold">
            About the University
            <span className="absolute -bottom-2 left-0 h-1 w-1/3 rounded-full bg-primary"></span>
          </h2>
          <div className="text-justify-lg">
            <HtmlContent html={university.description} />
          </div>
        </div>
      </div>

      {university.degrees.length > 0 && (
        <div className="mt-10 bg-white">
          <div className="content-container">
            <h2 className="relative mb-4 inline-block pt-8 text-3xl font-bold">
              Degrees Offered
              <span className="absolute -bottom-2 left-0 h-1 w-1/3 rounded-full bg-primary"></span>
            </h2>
          </div>
          <div className="flex flex-col">
            {university.degrees.map((sector, index) => (
              <div
                key={sector.sectorLink}
                className={`${index % 2 == 0 ? "bg-white" : "bg-background"} pb-10 pt-8`}
              >
                <div className="content-container">
                  <h1 className="mb-4 text-center text-xl font-semibold">
                    {sector.sectorName}
                  </h1>
                  <CarouselContainer
                    items={sector.degrees.map((degree) => ({
                      key: degree._id,
                      element: (
                        <DegreeCard
                          {...degree}
                          sector={{
                            name: sector.sectorName,
                          }}
                          university={{
                            name: university.name,
                          }}
                        />
                      ),
                    }))}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {university.colleges.length > 0 && (
        <div
          className={`${university?.degrees?.length % 2 == 0 ? "bg-white" : "bg-background"} pb-10 pt-8`}
        >
          <div className="content-container">
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
                    <CollegeCard
                      {...college}
                      university={{ name: university.name }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <section
        className={`${university?.degrees?.length % 2 == 0 ? "bg-background" : "bg-white"} pb-14 pt-8`}
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-900 text-primary md:text-3xl">
            Frequently Asked Questions
          </h2>
          <p className="mb-6 text-center text-lg text-gray-700 md:mb-10">
            Find answers to common questions about {university.name}
          </p>

          {faqItems && faqItems.length > 0 && <Faq faqItems={faqItems} />}
        </div>
      </section>
    </div>
  );
}
