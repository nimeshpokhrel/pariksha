import Head from "next/head";
import { CounsellingForm } from "@/components/CounsellingForm";

export default function CounsellingPage() {
  return (
    <>
      <Head>
        <title>Free Counselling for +2 Graduates | Pariksha</title>
        <meta
          name="description"
          content="Recent +2 graduate and confused about further studies? Book a free study and career counselling session with Pariksha."
        />
        <link rel="canonical" href="https://pariksha.solutions/counselling" />
      </Head>

      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto max-w-5xl px-4 py-8 md:px-6">
          <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <h1 className="mb-1 text-2xl font-bold text-primary">
              Book Your Free Counselling Session
            </h1>
            <p className="mb-6 text-sm text-muted-foreground">
              Fill in your details below and our counsellor will get in touch
              with you to guide you on your further studies.
            </p>
            <CounsellingForm />
          </div>
        </div>
      </div>
    </>
  );
}
