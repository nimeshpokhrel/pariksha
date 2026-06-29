import React from "react";
import { Button } from "@/components/ui/button";
import Input from "@/components/Input";
import TextEditorInput from "@/components/FormInputs/TextEditorInput";
import { DialogClose } from "@/components/ui/dialog";
import ImageInput from "@/components/FormInputs/ImageInput";

export default function CourseForm({
  errors,
  handleSubmit,
  register,
  setValue,
  watch,
}) {
  const description = watch("description") || "";
  const image = watch("image") || "";

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <Input
        name={"title"}
        label={"Course Title"}
        register={register}
        error={errors.title}
        required={true}
      />
      <Input
        name="link"
        label="Link"
        register={register}
        error={errors.link}
        required={true}
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
      <TextEditorInput
        label={"Description"}
        name={"description"}
        placeHolder="Enter Course Description"
        register={register}
        setValue={setValue}
        defaultValue={description}
        error={errors.description}
        required={true}
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
