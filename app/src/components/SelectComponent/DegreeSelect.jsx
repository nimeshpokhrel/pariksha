import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ComboboxInput } from "../FormInputs/ComboboxInput";
import { getDegrees } from "@/hooks/admin/degree";
import { MultiSelectCombobox } from "../FormInputs/MultiSelectCombobox";

export default function DegreeSelect({
  name,
  watch,
  setValue,
  register,
  error,
  required,
  className,
}) {
  const [degreesOptions, setDegreesOptions] = useState([]);
  const degree = watch(name) || "";

  const { data: allDegrees } = useQuery({
    queryKey: ["degrees"],
    queryFn: () => getDegrees(),
  });

  useEffect(() => {
    if (!allDegrees || allDegrees.length === 0) return;
    const options = allDegrees.map((degree) => ({
      value: degree._id,
      label: degree.name,
      group: degree.university._id,
      groupLabel: degree.university.name,
    }));
    setDegreesOptions(options);
  }, [allDegrees]);

  return (
    <MultiSelectCombobox
      name={name}
      label="Degrees"
      options={degreesOptions}
      setValue={setValue}
      register={register}
      error={error}
      placeholder="Select Degree"
      defaultValue={degree}
      className={className}
      required={required}
    />
  );
}
