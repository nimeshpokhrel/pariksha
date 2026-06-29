import React from "react";
import { FaPlus } from "react-icons/fa";
import Input from "../Input";

export default function FaqInput({ watch, setValue, register, errors }) {
  const faqs = watch("faqs");
  return (
    <div className="mt-10 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <label className="font-semibold">FAQs</label>
        <button
          type="button"
          onClick={() => {
            setValue("faqs", [...faqs, { question: "", answer: "" }]);
          }}
          className="flex items-center gap-2 rounded-md bg-primary px-3 py-1 text-sm text-white"
        >
          <FaPlus size={12} />
          Add FAQ
        </button>
      </div>

      {faqs &&
        faqs.map((faq, index) => (
          <div
            key={index}
            className="relative flex flex-col rounded-md border p-4 pt-8"
          >
            <button
              type="button"
              onClick={() => {
                setValue(
                  "faqs",
                  faqs.filter((_, i) => i !== index)
                );
              }}
              className="absolute right-4 top-4 text-lg font-bold text-red-500"
            >
              ✕
            </button>

            <Input
              name={`faqs.${index}.question`}
              label={`FAQ Question ${index + 1}`}
              placeholder="Enter FAQ question"
              register={register}
              error={errors?.faqs?.[index]?.question}
            />
            <Input
              name={`faqs.${index}.answer`}
              label={`FAQ Answer ${index + 1}`}
              placeholder="Enter FAQ answer"
              register={register}
              error={errors?.faqs?.[index]?.answer}
            />
          </div>
        ))}
    </div>
  );
}
