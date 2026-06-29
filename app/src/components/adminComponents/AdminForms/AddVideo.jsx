import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import Input from "@/components/Input";

const videoSchema = z.object({
  videoFile: z.string().trim().min(1, "Please provide a valid video file"),
  title: z.string().min(1, "Please Enter a valid title"),
  duration: z.string().trim().min(1, "Please provide a valid duration"),
});

export default function AddVideo({ handleFormSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(videoSchema) });

  const submitHandle = (data, event) => {
    event.preventDefault();
    handleFormSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandle)} className="mt-6">
      <Input
        name={"videoFile"}
        label={"Video Link"}
        placeHolder="Enter Video Link"
        register={register}
        error={errors.videoFile}
      />
      <Input
        name={"title"}
        label={"Video Title"}
        placeHolder="Enter Video Title"
        register={register}
        error={errors.title}
      />
      <Input
        name={"duration"}
        label={"Video Duration"}
        placeHolder="Enter Video Duration"
        register={register}
        error={errors.duration}
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
