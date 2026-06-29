import React, { useEffect, useState } from "react";
import entranceData from "./EntranceData.json";

interface ResultPageProps {
  slug: string;
}

const ResultPage: React.FC<ResultPageProps> = ({ slug }) => {
  const [examResult, setExamResult] = useState<any>(null);

  useEffect(() => {
    const result = entranceData.find((exam) => exam.slug === slug);
    setExamResult(result);
  }, [slug]);

  if (!examResult) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-lg text-gray-600">Loading or result not found...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8 md:px-6">
        {/* Exam Info */}
        <div className="mb-6 text-center">
          <h1 className="md:text-4xl text-2xl font-bold">Entrance Exam Results - {examResult.shortName}</h1>
          <h2 className="mt-2 text-lg md:text-2xl">{examResult.name}</h2>
          <p className="text-gray-600 mt-3">{examResult.university}</p>
          <p className="text-sm text-gray-500 mt-1">
            Exam Conducted On: {examResult.examCondutedOn}
          </p>
        </div>

        <div className="flex justify-center">
          <div className="h-[80vh] w-full overflow-hidden rounded border md:max-w-[70vw]">
            <iframe
              src={examResult.resultPdfLink}
              width="100%"
              height="100%"
              className="border-0"
              title="Entrance Exam PDF"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
