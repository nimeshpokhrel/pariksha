import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getUniversities } from "@/hooks/admin/university";
import { ComboboxInput } from "../FormInputs/ComboboxInput";

export default function UniversitySelect({
  name,
  watch,
  setValue,
  register,
  error,
  required,
  className,
}) {
  const [universitiesOptions, setUniversitiesOptions] = useState([]);
  const university = watch(name) || "";

  const { data: allUniversities } = useQuery({
    queryKey: ["universities"],
    queryFn: () => getUniversities(),
  });

  useEffect(() => {
    if (!allUniversities || allUniversities.length === 0) return;
    const options = allUniversities.map((university) => ({
      value: university._id,
      label: university.name,
    }));
    setUniversitiesOptions(options);
  }, [allUniversities]);
  return (
    <ComboboxInput
      name={name}
      label="University"
      setValue={setValue}
      options={universitiesOptions}
      register={register}
      error={error}
      defaultValue={university}
      placeholder="Select University"
      className={className}
      required={required}
    />
  );
}
