import { apiUrl } from "@/lib/config";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  GlobeIcon,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageGallery } from "@/components/CollegeImageGallery";
import UploadThingImage from "@/components/UploadThingImage";
import HtmlContent from "@/components/HtmlContent";
import Link from "next/link";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { DegreeCard } from "@/components/DegreeCard";
import Faq from "@/components/Faq";
import { Badge } from "@/components/ui/badge";
import { CollegeType } from "@/types/types";
import { ApplicationFormDialog } from "@/components/CollegeApplicationForm";

export async function getStaticPaths() {
  const res = await fetch(`${apiUrl}/college/getAllColleges`);
  const colleges = await res.json();

  const paths = colleges.data.map((college: CollegeType) => ({
    params: { link: college.link },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { link: string } }) {
  const link = params.link.trim();
  const res = await fetch(`${apiUrl}/college/getCollegeData/${link}`);

  const college = await res.json();

  if (!college) {
    return { notFound: true };
  }

  return {
    props: { college: college.data },
  };
}

export default function CollegePage({ college }: { college: CollegeType }) {
  const containerRefs = useRef<(HTMLElement | null)[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const scrollToTop = (index: number) => {
    if (!containerRefs.current) return;
    const container = containerRefs.current[index];
    if (container) {
      container.scrollIntoView({ behavior: "smooth" });
    }
  };

  const faqItems = [
    {
      question: `When was ${college.name} established?`,
      answer: `The ${college.name} was established in ${college.foundedYear}`,
    },
    {
      question: `Where is ${college.name} located?`,
      answer: `The ${college.name} is located in ${college.location}`,
    },
    {
      question: `What is the phone number of ${college.name}?`,
      answer: `The phone number of ${college.name} is ${college.phoneNumber}`,
    },
    {
      question: `What are the subjects taught in ${college.name}?`,
      answer: `The subjects taught in ${college.name} are ${college.degrees.map((degree) => degree.shortName).join(" • ")}`,
    },
    ...(college.faqs || []),
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[60vh] w-full sm:h-[65vh] md:h-[70vh]">
        <UploadThingImage
          imageLink={college.coverImage}
          alt={college.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute left-4 top-4 z-10">
          <Link href="/colleges">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Explore Other Colleges
            </Button>
          </Link>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl">
            <div className="mb-6 flex flex-col items-center gap-4 sm:mb-8 sm:flex-row">
              <div className="rounded-xl bg-white shadow-lg">
                <UploadThingImage
                  imageLink={college.logo}
                  alt={college.name}
                  width={80}
                  height={80}
                  className="max-h-32 min-h-32 min-w-32 max-w-32 object-contain"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl">
                  {college.name}
                </h1>
                <p className="mt-1 flex items-center text-base text-white/90 sm:mt-2 md:text-lg">
                  <MapPin className="mr-2 h-4 w-4" />
                  {college.location}
                </p>
                <Link
                  href={`/universities/${college.university.link}`}
                  className="text-white/90 hover:underline"
                >
                  <p className="mt-1 flex items-center text-base text-white/90 sm:mt-2 md:text-lg">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    {college.university.name}
                  </p>
                </Link>
              </div>
            </div>
            <h2 className="max-w-5xl text-lg font-bold leading-tight text-white sm:text-2xl md:text-3xl">
              {college.heading}
            </h2>
            <div className="mt-8 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
              <div className="relative">
                <Button
                  className="bg-secondary-90 px-8 py-5 text-lg text-white hover:bg-secondary"
                  onClick={() => setDialogOpen(true)}
                >
                  Apply Now
                </Button>
                <Badge
                  variant="destructive"
                  className="custom-pulse absolute -right-16 -top-3 rotate-3 transform"
                >
                  Scholarships Available
                </Badge>
              </div>
              {/* <Button
                size="sm"
                variant="outline"
                className="sm:size-lg bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
              >
                Virtual Tour
              </Button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-50 bg-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="scrollbar-hide flex w-full overflow-x-auto px-1 py-2 md:items-center md:gap-6 md:overflow-visible lg:gap-8">
              {["About", "Gallery", "Features", "Programs", "FAQ"].map(
                (label, index) => (
                  <Button
                    variant="ghost"
                    key={label}
                    className={`py-5 text-base font-semibold hover:bg-secondary-95 hover:text-white ${label == "Gallery" && (!college.gallery || college.gallery.length == 0) ? "hidden" : ""} ${label == "Features" && (!college.salientFeatures || college.salientFeatures.length == 0) ? "hidden" : ""}`}
                    onClick={() => scrollToTop(index)}
                  >
                    {label}
                  </Button>
                ),
              )}
            </div>
            <div className="ml-2 md:ml-0">
              <Button
                className="bg-secondary py-5 text-base hover:scale-105"
                onClick={() => setDialogOpen(true)}
              >
                Scholarship
              </Button>
            </div>
          </div>
        </div>
      </div>

      <section
        id="about"
        className="py-12 sm:py-14 md:py-16"
        ref={(el) => {
          containerRefs.current[0] = el;
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <h2 className="relative mb-6 text-2xl font-bold text-gray-900 sm:mb-6 sm:text-2xl md:text-3xl">
                About {college.name}
                <span className="absolute -bottom-2 left-0 h-1 w-1/3 rounded-full bg-primary"></span>
              </h2>
              <div className="text-justify-lg">
                <HtmlContent html={college.description} />
              </div>
              <div className="mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
                {college.facebookLink && (
                  <Link href={college.facebookLink} target="_blank">
                    <Button
                      variant="outline"
                      className="gap-2 text-sm sm:text-base"
                    >
                      <FaFacebookF className="h-3 w-3 sm:h-4 sm:w-4" />
                      Facebook
                    </Button>
                  </Link>
                )}
                {college.instagramLink && (
                  <Link href={college.instagramLink} target="_blank">
                    <Button
                      variant="outline"
                      className="gap-2 text-sm sm:text-base"
                    >
                      <FaInstagram className="h-3 w-3 sm:h-4 sm:w-4" />
                      Instagram
                    </Button>
                  </Link>
                )}
                {college.websiteLink && (
                  <Link href={college.websiteLink} target="_blank">
                    <Button
                      variant="outline"
                      className="gap-2 text-sm sm:text-base"
                    >
                      <GlobeIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      Website
                    </Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="relative mt-6 h-[300px] overflow-hidden rounded-xl shadow-xl sm:h-[350px] md:mt-0 md:h-[450px]">
              <UploadThingImage
                imageLink={college.coverImage}
                alt="College building"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900 text-primary sm:mb-10 sm:text-2xl md:mb-12 md:text-3xl">
            College Details
          </h2>
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
            <Card className="shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <ul className="space-y-3 sm:space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-secondary-10">
                      <div className="h-2 w-2 rounded-full bg-secondary"></div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">
                        Location:
                      </span>{" "}
                      {college.location}
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-secondary-10">
                      <div className="h-2 w-2 rounded-full bg-secondary"></div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">
                        Affiliation:
                      </span>{" "}
                      {college.university.name}
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-secondary-20">
                      <div className="h-2 w-2 rounded-full bg-secondary"></div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">
                        Founded:
                      </span>{" "}
                      {college.foundedYear}
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-secondary-10">
                      <div className="h-2 w-2 rounded-full bg-secondary"></div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">
                        Programs:
                      </span>{" "}
                      {college.degrees
                        .map((degree) => degree.shortName)
                        .join(" • ")}
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <ul className="space-y-3 sm:space-y-4">
                  {college.salientFeatures &&
                    college?.salientFeatures?.length > 0 && (
                      <li className="flex items-center gap-3">
                        <span className="font-medium text-gray-900">
                          <Star className="h-4 w-4" />
                        </span>{" "}
                        {college?.salientFeatures?.join(" • ")}
                      </li>
                    )}
                  <li className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-base">{college.emailLink}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-base">{college.phoneNumber}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {college.gallery && college.gallery.length > 0 && (
        <section
          id="gallery"
          className="py-10"
          ref={(el) => {
            containerRefs.current[1] = el;
          }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-4 text-2xl font-bold text-primary sm:text-2xl md:text-3xl">
              Campus Gallery
            </h2>
            <p className="mb-6 max-w-3xl text-lg text-gray-700">
              Explore our state-of-the-art facilities and vibrant campus life.
            </p>

            <ImageGallery images={[college.coverImage, ...college.gallery]} />
          </div>
        </section>
      )}
      {college.salientFeatures && college.salientFeatures.length > 0 && (
        <section
          id="features"
          className="bg-white py-12 sm:py-14 md:py-16"
          ref={(el) => {
            containerRefs.current[2] = el;
          }}
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-4 text-center text-2xl font-bold text-gray-900 text-primary sm:mb-6 sm:text-2xl md:text-3xl">
              Salient Features
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {college.salientFeatures?.map((feature, index) => (
                <Card
                  key={feature}
                  className="overflow-hidden border-0 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div
                    className={`h-2 ${index % 2 === 0 ? "bg-primary" : "bg-secondary"}`}
                  ></div>
                  <CardContent className="p-4 text-center sm:p-6">
                    <h3 className="text-lg font-bold sm:text-xl">{feature}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Courses Section */}
      <section
        id="courses"
        className="py-12 sm:py-14 md:py-16"
        ref={(el) => {
          containerRefs.current[3] = el;
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-900 text-primary md:text-3xl">
            Programs Offered
          </h2>
          <p className="mb-8 text-center text-lg text-gray-700 sm:mb-10 md:mb-12">
            Explore our range of courses and degrees
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
            {college.degrees.map((course) => (
              <DegreeCard key={course._id} {...course} />
            ))}
          </div>
        </div>
      </section>

      <section
        className="bg-white py-12 sm:py-14 md:py-16"
        ref={(el) => {
          containerRefs.current[4] = el;
        }}
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-900 text-primary md:text-3xl">
            Frequently Asked Questions
          </h2>
          <p className="mb-6 text-center text-lg text-gray-700 md:mb-10">
            Find answers to common questions about {college.name}
          </p>

          {faqItems && faqItems.length > 0 && <Faq faqItems={faqItems} />}
        </div>
      </section>

      {/* <section className="py-12 sm:py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold sm:mb-6 sm:text-2xl md:text-3xl">
            Interested in This College?
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-sm sm:mb-8 sm:text-base">
            Take the first step towards your future. Apply now or schedule a
            campus visit to learn more about our programs and facilities.
          </p>

          <Button size="lg" className="hover:scale-105">
            Apply Now
          </Button>
        </div>
      </section> */}
      <ApplicationFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        degrees={college.degrees}
        collegeName={college.name}
      />
    </div>
  );
}
