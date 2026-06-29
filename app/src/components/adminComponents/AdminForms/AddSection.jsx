import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import Input from "@/components/Input";

const sectionSchema = z.object({
  title: z.string().min(1, "Please Enter a valid title"),
});

export default function AddSection({ handleFormSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: zodResolver(sectionSchema) });

  const submitHandle = (data, event) => {
    event.preventDefault();
    handleFormSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(submitHandle)} className="mt-6">
      <Input
        name={"title"}
        label={"Section Title"}
        placeHolder="Enter Section Title"
        register={register}
        error={errors.title}
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
