import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import Input from "@/components/Input";
import TextEditorInput from "@/components/FormInputs/TextEditorInput";

const subjectSchema = z.object({
  title: z.string().min(1, "Please Enter a valid title"),
  link: z.string().min(1, "Please Enter a valid link"),
  number: z.string().min(1, "Please Enter a valid number"),
  setType: z.enum(["mock", "past"]),
});
const setTypeOptions = [
  { value: "mock", label: "Mock Test" },
  { value: "past", label: "Past Question Set" },
];

export default function AddQuestionSet({ handleFormSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: zodResolver(subjectSchema) });

  const [questionSetType, setQuestionSetType] = useState(null);
  useEffect(() => {
    if (questionSetType) {
      setValue("setType", questionSetType);
    }
  }, [questionSetType]);

  const submitHandle = (data, event) => {
    event.preventDefault();
    handleFormSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandle)} className="mt-6">
      <Input
        name={"title"}
        label={"Question Set Title"}
        placeholder={"Enter a title for the question set"}
        register={register}
        error={errors.title}
      />
      <Input
        name="link"
        label="Question Set Link"
        placeholder={"Enter a link for the question set"}
        register={register}
        error={errors.link}
      />
      <Input
        name="number"
        label="Question Set Display Title"
        placeholder={"Enter a display title for the question set"}
        register={register}
        error={errors.link}
      />

      <div className="mb-4 flex w-full flex-col">
        <label htmlFor="setType" className="mb-1 pl-2 text-xs text-gray-500">
          Select The Question Set Type
        </label>
        <input
          type="hidden"
          id="setType"
          {...register("setType")}
          className="border-b-2 pb-1 outline-none"
        />
        <div className="mt-2 grid grid-cols-3 gap-4 max-[420px]:grid-cols-2">
          {setTypeOptions.map((option, index) => (
            <button
              type="button"
              key={index}
              className={`whitespace-nowrap border border-gray-semiDark px-2 py-2 text-center text-sm ${questionSetType === option.value ? "bg-primary text-white" : ""}`}
              onClick={() => setQuestionSetType(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="h-6">
          {errors.setType && (
            <span className="text-xs text-red-500">
              Please Select the Question Set Type
            </span>
          )}
        </div>
      </div>

      <TextEditorInput
        label={"Description"}
        name={"description"}
        placeHolder="Enter Test Description"
        register={register}
        setValue={setValue}
        height="100px"
        error={errors.description}
      />

      <div className="mt-8 flex items-center justify-end gap-4">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Close
          </Button>
        </DialogClose>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
