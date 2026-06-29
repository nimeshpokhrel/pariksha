import React from "react";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import Input from "@/components/Input";
import ImageInput from "@/components/FormInputs/ImageInput";

export default function SubjectForm({
  errors,
  register,
  handleSubmit,
  watch,
  setValue,
}) {
  const image = watch("image") || "";

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <Input
        name={"title"}
        label={"Subject Title"}
        register={register}
        error={errors.title}
      />
      <Input
        name={"link"}
        label={"Subject Link"}
        register={register}
        error={errors.link}
      />
      <Input
        name="duration"
        label="Subject Videos Duration"
        register={register}
        error={errors.duration}
      />

      <ImageInput
        label={"Cover Image"}
        register={register}
        name={"image"}
        defaultValue={image}
        error={errors.image}
        setValue={setValue}
        required
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
