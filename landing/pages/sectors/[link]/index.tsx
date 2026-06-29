import { apiUrl } from "@/lib/config";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import IconDisplay from "@/components/IconDisplay";
import HtmlContent from "@/components/HtmlContent";
import { SectorType } from "@/types/types";
import { DegreeCard } from "@/components/DegreeCard";
import CarouselContainer from "@/components/CarousalContainer";
import { CollegeCard } from "@/components/CollegeCard";
import UploadThingImage from "@/components/UploadThingImage";
import { AeccCard } from "@/components/AeccCard";

export async function getStaticPaths() {
  const res = await fetch(`${apiUrl}/sector/getAllSectors`);
  const sectors = await res.json();

  const paths = sectors.data.map((sector: SectorType) => ({
    params: { link: sector.link },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { link: string } }) {
  const link = params.link.trim();
  const res = await fetch(`${apiUrl}/sector/getSectorData/${link}`);

  const sector = await res.json();

  if (!sector) {
    return { notFound: true };
  }

  return {
    props: { sector: sector.data },
  };
}

export default function SectorPage({ sector }: { sector: SectorType }) {
  const displayCollege = [
    ...sector.colleges.slice(0, 3),
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
    ...sector.colleges.slice(3),
  ];
  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[250px] w-full md:h-[400px] lg:h-[500px]">
        <UploadThingImage
          imageLink={sector.coverImage}
          alt={`${sector.name}`}
          className="h-full w-full object-cover"
          fill
          priority
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute left-4 top-4 z-10">
          <Link href="/sectors">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Explore Other Sectors
            </Button>
          </Link>
        </div>
      </div>

      <div className="content-container relative z-10 mx-auto">
        <div className="relative z-10 -mt-16 mb-8 rounded-2xl bg-white p-6 shadow-md md:-mt-24">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold md:text-4xl">{sector.name}</h1>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="content-container-small mt-4 py-14 md:mt-8">
          <h2 className="relative mb-6 inline-block text-3xl font-bold">
            About the Sector
            <span className="absolute -bottom-2 left-0 h-1 w-1/3 rounded-full bg-primary"></span>
          </h2>
          <div className="text-justify-lg">
            <HtmlContent html={sector.description} />
          </div>
        </div>
        <div className="bg-white pb-20 pt-16">
          <div className="content-container-small">
            <h2 className="relative mb-6 inline-block text-2xl font-bold text-primary">
              Areas of Study
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {sector.areasOfStudy.map((area) => (
                <div
                  className="w-full rounded-2xl border border-primary-20 bg-muted px-6 py-4 text-left"
                  key={area.title}
                >
                  <h3 className="text-base font-semibold text-primary">
                    {area.title}
                  </h3>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <span>{area.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="content-container-small py-14">
          <h2 className="relative mb-6 inline-block text-2xl font-bold text-primary">
            Career Prospect
          </h2>
          <div className="grid h-full grid-cols-1 justify-center gap-6 md:grid-cols-2 md:gap-8">
            {sector.careerProspect.map((prospect) => (
              <div
                className="flex items-center justify-between gap-2 rounded-2xl border border-primary px-6 py-4 text-left"
                key={prospect.title}
              >
                <h3 className="text-md font-semibold text-primary">
                  {prospect.title}
                </h3>
                <div className="text-4xl text-primary opacity-40">
                  <IconDisplay icon={prospect.icon} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {sector.degrees.length > 0 && (
        <div className="bg-white">
          <div className="mt-10">
            <div className="content-container-small">
              <h2 className="relative mb-4 inline-block pt-8 text-3xl font-bold">
                Degrees Offered
                <span className="absolute -bottom-2 left-0 h-1 w-1/3 rounded-full bg-primary"></span>
              </h2>
            </div>
            <div className="flex flex-col">
              {sector.degrees.map((university, index) => (
                <div
                  key={university._id}
                  className={`${index % 2 == 0 ? "bg-white" : "bg-background"} pb-10 pt-8`}
                >
                  <div className="content-container">
                    <h1 className="mb-4 text-center text-xl font-semibold">
                      {university.universityName}
                    </h1>
                    <CarouselContainer
                      items={university.degrees.map((degree) => ({
                        key: degree._id,
                        element: (
                          <DegreeCard
                            {...degree}
                            sector={{
                              name: sector.name,
                            }}
                            university={{
                              name: university.universityName,
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
        </div>
      )}

      {displayCollege.length > 0 && (
        <div
          className={`${sector?.degrees?.length % 2 == 0 ? "bg-white" : "bg-background"} pb-10 pt-8`}
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
                    <CollegeCard {...college} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
