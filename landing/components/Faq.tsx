import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {
  faqItems: Array<{
    question: string;
    answer: string;
  }>;
  type?: "single" | "multiple";
};

export default function Faq({ faqItems, type = "multiple" }: Props) {
  return (
    <>
      <Accordion type={type} className="w-full">
        {faqItems.map((item) => (
          <AccordionItem key={item.question} value={item.question}>
            <AccordionTrigger className="text-left text-sm sm:text-base">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm sm:text-base">
              ⇥ {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
