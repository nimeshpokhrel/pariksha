import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Input from "@/components/Input";
import { DialogClose } from "@/components/ui/dialog";
import { getColleges } from "@/hooks/admin/college";
import { useQuery } from "@tanstack/react-query";
import { ComboboxInput } from "@/components/FormInputs/ComboboxInput";

export default function AdForm({
  errors,
  handleSubmit,
  register,
  setValue,
  watch,
}) {
  const [collegeOptions, setCollegeOptions] = useState([]);
  const { data: allColleges } = useQuery({
    queryKey: ["colleges"],
    queryFn: () => getColleges(),
  });
  const link = watch("link") || "";

  useEffect(() => {
    if (!allColleges || allColleges.length === 0) return;
    const options = allColleges.map((college) => ({
      value: college.link,
      label: college.name,
    }));
    setCollegeOptions(options);
  }, [allColleges]);

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <Input
        name="banner100"
        label="Banner 100 URL"
        placeholder="https://example.com/banner100.jpg"
        register={register}
        error={errors.banner100}
        required
      />
      <Input
        name="banner200"
        label="Banner 200 URL"
        placeholder="https://example.com/banner200.jpg"
        register={register}
        error={errors.banner200}
        required
      />
      <Input
        name="fullPageMobile"
        label="Full Page Mobile URL"
        placeholder="https://example.com/fullpage-mobile.jpg"
        register={register}
        error={errors.fullPageMobile}
        required
      />
      <Input
        name="fullPageDesktop"
        label="Full Page Desktop URL"
        placeholder="https://example.com/fullpage-desktop.jpg"
        register={register}
        error={errors.fullPageDesktop}
        required
      />
      <Input
        name="video"
        label="Video Ad URL"
        placeholder="https://example.com/video.mp4"
        register={register}
        error={errors.video}
        required
      />

      <ComboboxInput
        label="College"
        name="link"
        setValue={setValue}
        options={collegeOptions}
        register={register}
        error={errors.link}
        defaultValue={link}
        placeholder="Select College"
        className="mb-12 mt-8"
        required={true}
      />
      <Input
        name="probability"
        label="Display Probability (0-1)"
        placeholder="e.g., 0.8"
        type="number"
        step="0.01"
        register={register}
        error={errors.probability}
        required
      />
      <Input
        name="location"
        label="College Location"
        placeholder="e.g., Kathmandu"
        register={register}
        error={errors.location}
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
