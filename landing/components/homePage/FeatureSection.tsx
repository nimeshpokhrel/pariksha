import Image from "next/image";

const features = [
  {
    icon: "video",
    title: "Video Lectures",
    description:
      "Master your exams with expert-led video lectures anytime, anywhere!",
  },
  {
    icon: "notes",
    title: "Notes",
    description:
      "Simplify your studies with comprehensive, expertly crafted notes.",
  },
  {
    icon: "mock",
    title: "Mock Tests",
    description: "Boost your confidence with realistic, exam-ready mock tests.",
  },
  {
    icon: "past",
    title: "Past Questions",
    description:
      "Practice smarter with a vast collection of past exam questions.",
  },
];

export function FeatureSection() {
  return (
    <section className="px-4">
      <h2 className="mb-0.5 text-center text-4xl font-bold text-primary">
        Features
      </h2>
      <p className="mb-8 text-center font-normal text-foreground lg:mb-12">
        What We Offer
      </p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-8">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <Image
              src={`/images/feature-section/${feature.icon}.png`}
              alt={feature.title}
              width={200}
              height={196}
            />

            <h3 className="mb-2 mt-2 text-lg font-medium text-primary lg:text-xl">
              {feature.title}
            </h3>
            <p className="text-xs text-foreground lg:text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
