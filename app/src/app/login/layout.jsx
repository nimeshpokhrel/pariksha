import { Card } from "@/components/ui/card";
import { TypewriterEffectSequential } from "@/components/ui/typewriter-effect";
import Image from "next/image";

export const metadata = {
  title: "Pariksha : Login",
  description: "Pariksha : Login",
};

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white bg-[url('/background.png')] bg-[length:927px_500px] bg-repeat lg:bg-primary">
      <Card className="mx-auto grid min-h-screen w-full max-w-[1000px] grid-cols-1 rounded-none bg-white/70 lg:min-h-0 lg:grid-cols-2 lg:rounded-3xl lg:bg-white">
        <div className="relative hidden w-full flex-col items-center justify-center rounded-l-3xl p-8 lg:flex">
          <div className="absolute left-6 top-6">
            <Image
              src={"/logo/ParikshaLogo.png"}
              width={150}
              height={47}
              alt="Pariksha"
            />
          </div>

          <div className="relative mb-6 mt-12">
            <Image
              src="/student-jumping.png"
              alt="Student"
              width={280}
              height={280}
            />
          </div>

          <div className="text-3xl font-semibold text-primary">
            Free Entrance Preparation
            <div className="mt-0 h-6 md:h-12">
              <TypewriterEffectSequential
                phrases={[
                  { text: "BSc. CSIT" },
                  { text: "CMAT" },
                  { text: "BCA" },
                  { text: "BIT" },
                ]}
                textColor="text-[#FEA602] text-4xl font-bold md:text-5xl"
                cursorColor="bg-primary"
              />
            </div>
          </div>

          {/* <div className="mt-4 text-center">
            <h2 className="text-4xl font-bold text-amber-500">
              FREE <span className="text-2xl text-black">Exam</span>
            </h2>
            <h3 className="mb-2 text-2xl font-bold text-black">Preparation</h3>
            <p className="text-xl text-black">
              with{" "}
              <span className="text-4xl font-bold text-amber-500">
                PARIKSHA
              </span>
            </p>
          </div> */}
        </div>
        <div className="flex items-center justify-center bg-transparent lg:hidden">
          <Image
            src={"/logo/ParikshaLogo.png"}
            width={300}
            height={100}
            alt="Pariksha"
          />
        </div>
        <div className="rounded-t-3xl bg-white lg:rounded-l-none lg:rounded-r-3xl">
          <div className="flex h-full flex-1 items-center justify-center rounded-t-3xl bg-primary/30 px-8 py-8 lg:rounded-l-none lg:rounded-r-3xl">
            {children}
          </div>
        </div>
      </Card>
    </div>
  );
}
