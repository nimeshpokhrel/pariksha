import React from "react";
import { Button } from "@/components/ui/button";
import Input from "@/components/Input";
import TextEditorInput from "@/components/FormInputs/TextEditorInput";
import { DialogClose } from "@/components/ui/dialog";
import ImageInput from "@/components/FormInputs/ImageInput";
import FaqInput from "@/components/FormInputs/FaqInput";
import { ComboboxInput } from "@/components/FormInputs/ComboboxInput";

const ownerShipOptions = [
  { value: "Public", label: "Public" },
  { value: "Private", label: "Private" },
  { value: "Government", label: "Government" },
  { value: "Semi-Government", label: "Semi-Government" },
];

export default function UniversityForm({
  errors,
  handleSubmit,
  register,
  setValue,
  watch,
}) {
  const logo = watch("logo") || "";
  const description = watch("description") || "";
  const coverImage = watch("coverImage") || "";
  const ownership = watch("ownership");

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <Input
        name={"link"}
        label={"University Slug Link"}
        placeholder="eg: kathmandu-university"
        register={register}
        error={errors.link}
        required={true}
      />
      <Input
        name={"name"}
        label={"University Name"}
        register={register}
        error={errors.name}
        required={true}
      />
      <div className="mb-8 flex w-full gap-4">
        <ImageInput
          label={"University Logo"}
          register={register}
          name={"logo"}
          defaultValue={logo}
          error={errors.logo}
          setValue={setValue}
          required
        />

        <ImageInput
          label={"University Cover Image"}
          register={register}
          name={"coverImage"}
          defaultValue={coverImage}
          error={errors.coverImage}
          setValue={setValue}
          required
        />
      </div>

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
      <Input
        name="websiteLink"
        label="University Website Link"
        required={true}
        register={register}
        error={errors.websiteLink}
      />
      <Input
        name="establishments"
        label="Establishments Count"
        required={true}
        placeHolder="eg: 1000+ , 250+"
        register={register}
        error={errors.establishments}
      />
      <Input
        name="location"
        label="University Location"
        required={true}
        placeHolder="eg: Kathmandu, Nepal"
        register={register}
        error={errors.location}
      />
      <Input
        name="foundedYear"
        label="Founded Year"
        required={true}
        register={register}
        error={errors.foundedYear}
      />
      <Input
        name="students"
        label="Students Count"
        required={true}
        placeHolder="eg: 1000+ , 250+"
        register={register}
        error={errors.students}
      />
      <ComboboxInput
        name="ownership"
        label="Ownership"
        setValue={setValue}
        options={ownerShipOptions}
        register={register}
        error={errors.ownership}
        placeholder="Select Ownership Type"
        defaultValue={ownership}
        required={true}
      />

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
