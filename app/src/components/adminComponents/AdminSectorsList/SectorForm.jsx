import React from "react";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import Input from "@/components/Input";
import TextEditorInput from "@/components/FormInputs/TextEditorInput";
import { DialogClose } from "@/components/ui/dialog";
import IconSelect from "@/components/FormInputs/IconSelect";
import ImageInput from "@/components/FormInputs/ImageInput";
import FaqInput from "@/components/FormInputs/FaqInput";

export default function SectorForm({
  errors,
  handleSubmit,
  register,
  setValue,
  watch,
}) {
  const areasOfStudy = watch("areasOfStudy") || [];
  const careerProspect = watch("careerProspect") || [];
  const description = watch("description") || "";
  const coverImage = watch("coverImage") || "";

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <Input
        name="link"
        label="Sector Slug Link"
        placeholder="eg: technology-sector"
        register={register}
        error={errors.link}
        required={true}
      />
      <Input
        name="name"
        label="Sector Name"
        register={register}
        error={errors.name}
        required={true}
      />
      <ImageInput
        label={"Sector Cover Image"}
        register={register}
        name={"coverImage"}
        defaultValue={coverImage}
        error={errors.coverImage}
        setValue={setValue}
        required
      />
      <TextEditorInput
        label="Description"
        name="description"
        required={true}
        placeHolder="Enter Sector Description"
        register={register}
        setValue={setValue}
        defaultValue={description}
        error={errors.description}
      />

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <label className="font-semibold">Areas of Study</label>
          <Button
            type="button"
            onClick={() =>
              setValue("areasOfStudy", [
                ...areasOfStudy,
                { title: "", description: "" },
              ])
            }
            className="flex items-center gap-2 rounded-md bg-primary px-3 py-1 text-sm text-white"
          >
            <FaPlus size={12} />
            Add
          </Button>
        </div>
        {areasOfStudy && areasOfStudy.length > 0 && (
          <div className="mt-2 border">
            {areasOfStudy.map((area, index) => (
              <div
                key={index}
                className="relative flex flex-col rounded-md border-b p-4 last:border-0"
              >
                <button
                  type="button"
                  onClick={() =>
                    setValue(
                      "areasOfStudy",
                      areasOfStudy.filter((_, i) => i !== index)
                    )
                  }
                  className="absolute right-4 top-4 text-lg font-bold text-red-500"
                >
                  ✕
                </button>
                <Input
                  name={`areasOfStudy.${index}.title`}
                  label={`Area Title ${index + 1}`}
                  placeholder="Enter area title"
                  register={register}
                  error={errors.areasOfStudy?.[index]?.title}
                  required
                />
                <Input
                  name={`areasOfStudy.${index}.description`}
                  label={`Area Description ${index + 1}`}
                  placeholder="Enter area description"
                  register={register}
                  error={errors.areasOfStudy?.[index]?.description}
                  required
                />
              </div>
            ))}
          </div>
        )}
        <div className="h-6">
          {errors.areasOfStudy && (
            <span className="text-xs text-red-500">
              {errors.areasOfStudy.message || errors.areasOfStudy.root.message}
            </span>
          )}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <label className="font-semibold">Career Prospect</label>
          <Button
            type="button"
            onClick={() =>
              setValue("careerProspect", [
                ...careerProspect,
                { title: "", icon: "" },
              ])
            }
            className="flex items-center gap-2 rounded-md bg-primary px-3 py-1 text-sm text-white"
          >
            <FaPlus size={12} />
            Add Prospect
          </Button>
        </div>
        {careerProspect && careerProspect.length > 0 && (
          <div className="mt-2 border">
            {careerProspect.map((prospect, index) => (
              <div
                key={index}
                className="relative flex flex-col rounded-md border-b p-4 last:border-0"
              >
                <button
                  type="button"
                  onClick={() =>
                    setValue(
                      "careerProspect",
                      careerProspect.filter((_, i) => i !== index)
                    )
                  }
                  className="absolute right-4 top-4 text-lg font-bold text-red-500"
                >
                  ✕
                </button>
                <Input
                  name={`careerProspect.${index}.title`}
                  label={`Prospect Title ${index + 1}`}
                  placeholder="Enter prospect title"
                  register={register}
                  error={errors.careerProspect?.[index]?.title}
                  required
                />
                <IconSelect
                  name={`careerProspect.${index}.icon`}
                  label={`Prospect Icon ${index + 1}`}
                  placeholder="Select The Icon"
                  defaultValue={prospect?.icon}
                  register={register}
                  error={errors.careerProspect?.[index]?.icon}
                  setValue={setValue}
                  required
                />
              </div>
            ))}
          </div>
        )}
        {errors.careerProspect && (
          <span className="text-xs text-red-500">
            {errors.careerProspect.message ||
              errors.careerProspect.root.message}
          </span>
        )}
      </div>

      <FaqInput
        setValue={setValue}
        register={register}
        errors={errors}
        watch={watch}
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
