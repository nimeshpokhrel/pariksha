import React from "react";
import ResultPage from "@/components/entranceResult/ResultPage";

interface EntranceResultProps {
  slug: string;
}

const EntranceResult = ({ slug }: EntranceResultProps) => {
  return <ResultPage slug={slug} />;
};

export default EntranceResult;

// Fetch slug from URL
export async function getServerSideProps(context: { params: { slug: string } }) {
  const { slug } = context.params;
  return {
    props: { slug },
  };
}
