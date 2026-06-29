import React from "react";
import { Button } from "@/components/ui/button";

import TextEditorInput from "@/components/FormInputs/TextEditorInput";
import Input from "@/components/Input";

import ImageInput from "@/components/FormInputs/ImageInput";
import ImageInputMultiple from "@/components/FormInputs/ImageInputMultiple";
import FaqInput from "@/components/FormInputs/FaqInput";
import UniversitySelect from "@/components/SelectComponent/UniversitySelect";
import { FaPlus } from "react-icons/fa";
import { DialogClose } from "@/components/ui/dialog";
import DegreeSelect from "@/components/SelectComponent/DegreeSelect";

export default function CollegeForm({
  handleSubmit,
  register,
  errors,
  setValue,
  watch,
}) {
  const salientFeatures = watch("salientFeatures");
  const description = watch("description") || "";
  const logo = watch("logo") || "";
  const coverImage = watch("coverImage") || "";
  const gallery = watch("gallery") || "";

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <Input
        name={"link"}
        label={"College Slug Link"}
        placeholder="eg: kathmandu-college"
        register={register}
        error={errors.link}
        required={true}
      />
      <Input
        name={"name"}
        label={"College Name"}
        register={register}
        error={errors.name}
        required={true}
      />
      <Input
        name="heading"
        label="College Heading"
        placeholder="eg: Welcome to College Name"
        register={register}
        error={errors.heading}
        required={true}
      />

      <UniversitySelect
        name="university"
        watch={watch}
        setValue={setValue}
        register={register}
        error={errors.university}
        className={"mb-10"}
        required
      />
      <DegreeSelect
        name={"degrees"}
        watch={watch}
        setValue={setValue}
        register={register}
        error={errors.degrees}
        className={"mb-10"}
        required
      />
      <div className="mb-8 w-full gap-4 md:flex">
        <ImageInput
          label={"College Logo"}
          register={register}
          name={"logo"}
          defaultValue={logo}
          error={errors.logo}
          setValue={setValue}
          required
        />

        <ImageInput
          label={"College Cover Image"}
          register={register}
          name={"coverImage"}
          defaultValue={coverImage}
          error={errors.coverImage}
          setValue={setValue}
          required
        />
      </div>
      <Input
        name="location"
        label="College Location"
        required={true}
        placeholder="eg: Kathmandu, Nepal"
        register={register}
        error={errors.location}
      />
      <Input
        name="facebookLink"
        label="Facebook Link"
        placeholder="eg: https://facebook.com/collegename"
        register={register}
        error={errors.facebookLink}
      />
      <Input
        name="instagramLink"
        label="Instagram Link"
        placeholder="eg: https://instagram.com/collegename"
        register={register}
        error={errors.instagramLink}
      />
      <Input
        name="websiteLink"
        label="Website Link"
        placeholder="eg: https://collegename.edu.np"
        register={register}
        error={errors.websiteLink}
      />
      <Input
        name="emailLink"
        label="Email Address"
        placeholder="eg: info@collegename.edu.np"
        register={register}
        error={errors.emailLink}
      />
      <Input
        name="phoneNumber"
        label="Phone Number"
        placeholder="eg: +977-1-4444444"
        register={register}
        error={errors.phoneNumber}
        required={true}
      />

      <TextEditorInput
        label={"Description"}
        name={"description"}
        required={true}
        placeholder="Enter College Description"
        register={register}
        setValue={setValue}
        defaultValue={description}
        error={errors.description}
      />

      <Input
        name="foundedYear"
        label="Founded Year"
        placeholder="eg: 1990"
        register={register}
        error={errors.foundedYear}
        required={true}
      />

      <Input
        name="priority"
        label="Priority"
        placeholder="Enter priority (numeric)"
        register={register}
        error={errors.priority}
        type="number"
        defaultValue={20}
      />

      <div className="mb-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="font-semibold">Salient Features</label>
          <button
            type="button"
            onClick={() => {
              setValue("salientFeatures", [...salientFeatures, ""]);
            }}
            className="flex items-center gap-2 rounded-md bg-primary px-3 py-1 text-sm text-white"
          >
            <FaPlus size={12} />
            Add Salient Feature
          </button>
        </div>

        {salientFeatures && salientFeatures.length > 0 && (
          <div className="border">
            {salientFeatures &&
              salientFeatures.map((salientFeature, index) => (
                <div
                  key={index}
                  className="relative flex flex-col rounded-md p-4"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setValue(
                        "salientFeatures",
                        salientFeatures.filter((_, i) => i !== index)
                      );
                    }}
                    className="absolute right-4 top-4 text-lg font-bold text-red-500"
                  >
                    ✕
                  </button>

                  <Input
                    name={`salientFeatures.${index}`}
                    label={`Salient Feature ${index + 1}`}
                    placeholder="Enter Salient Feature"
                    register={register}
                    error={errors?.salientFeatures?.[index]}
                    noError={true}
                  />
                </div>
              ))}
          </div>
        )}
      </div>

      <div>
        <ImageInputMultiple
          label={"College Gallery"}
          register={register}
          name={"gallery"}
          defaultValue={gallery}
          error={errors.gallery}
          setValue={setValue}
          required
        />
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
