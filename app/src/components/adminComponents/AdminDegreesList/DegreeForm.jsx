import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import Input from "@/components/Input";
import TextEditorInput from "@/components/FormInputs/TextEditorInput";
import { DialogClose } from "@/components/ui/dialog";
import ImageInput from "@/components/FormInputs/ImageInput";
import { getSectors } from "@/hooks/admin/sector";
import { ComboboxInput } from "@/components/FormInputs/ComboboxInput";
import { useQuery } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import UniversitySelect from "@/components/SelectComponent/UniversitySelect";
import FaqInput from "@/components/FormInputs/FaqInput";

export default function DegreeForm({
  errors,
  handleSubmit,
  register,
  setValue,
  watch,
}) {
  const [sectorsOptions, setSectorsOptions] = useState([]);
  const eligibilityCriteria = watch("eligibilityCriteria") || [];
  const gradingSystem = watch("gradingSystem") || [];
  const courseStructure = watch("courseStructure") || [];
  const description = watch("description") || "";
  const coverImage = watch("coverImage") || "";
  const sector = watch("sector") || "";

  const { data: allSectors } = useQuery({
    queryKey: ["sectors"],
    queryFn: () => getSectors(),
  });

  useEffect(() => {
    if (!allSectors || allSectors.length === 0) return;
    const options = allSectors.map((sector) => ({
      value: sector._id,
      label: sector.name,
    }));
    setSectorsOptions(options);
  }, [allSectors]);

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <Input
        name="link"
        label="Degree Slug Link"
        placeholder="eg: bba-tu"
        register={register}
        error={errors.link}
        required={true}
      />
      <Input
        name="name"
        label="Degree Name"
        placeholder="eg: Bachelor of Business Administration"
        register={register}
        error={errors.name}
        required={true}
      />
      <Input
        name="shortName"
        label="Short Name (Optional)"
        placeholder="eg: BBA, CSIT"
        register={register}
        error={errors.shortName}
      />

      <Input
        name="duration"
        label="Duration"
        placeholder="Enter Duration (in years)"
        register={register}
        error={errors.duration}
        type="number"
        required={true}
      />
      <Input
        name="semesterCount"
        label="Semester Count"
        placeholder="Enter semester count (in number)"
        register={register}
        error={errors.semesterCount}
        type="number"
        required={true}
      />

      <UniversitySelect
        name="university"
        watch={watch}
        setValue={setValue}
        register={register}
        error={errors.university}
        required
      />

      <ComboboxInput
        label="Sector"
        name="sector"
        setValue={setValue}
        options={sectorsOptions}
        register={register}
        error={errors.sector}
        defaultValue={sector}
        placeholder="Select Sector"
        className="mb-12 mt-8"
        required={true}
      />
      <ImageInput
        label="Degree Cover Image"
        register={register}
        name="coverImage"
        defaultValue={coverImage}
        error={errors.coverImage}
        setValue={setValue}
        required={true}
      />

      <TextEditorInput
        label="Description"
        name="description"
        required={true}
        placeHolder="Enter Degree Description"
        register={register}
        setValue={setValue}
        defaultValue={description}
        error={errors.description}
      />

      <div className="mb-14">
        <div className="flex items-center justify-between">
          <label className="font-semibold">Eligibility Criteria</label>
          <Button
            type="button"
            onClick={() =>
              setValue("eligibilityCriteria", [
                ...eligibilityCriteria,
                { title: "", description: "" },
              ])
            }
            className="flex items-center gap-2 rounded-md bg-primary px-3 py-1 text-sm text-white"
          >
            <FaPlus size={12} />
            Add Criteria
          </Button>
        </div>
        {eligibilityCriteria.length > 0 && (
          <div className="mt-2 border">
            {eligibilityCriteria.map((criteria, index) => (
              <div
                key={index}
                className="relative flex flex-col rounded-md border-b p-4 last:border-0"
              >
                <button
                  type="button"
                  onClick={() =>
                    setValue(
                      "eligibilityCriteria",
                      eligibilityCriteria.filter((_, i) => i !== index)
                    )
                  }
                  className="absolute right-4 top-4 text-lg font-bold text-red-500"
                >
                  ✕
                </button>
                <Input
                  name={`eligibilityCriteria.${index}.title`}
                  label={`Criteria Title ${index + 1}`}
                  placeholder="Enter criteria title"
                  register={register}
                  error={errors.eligibilityCriteria?.[index]?.title}
                  required
                />
                <Input
                  name={`eligibilityCriteria.${index}.description`}
                  label={`Criteria Description ${index + 1}`}
                  placeholder="Enter criteria description"
                  register={register}
                  error={errors.eligibilityCriteria?.[index]?.description}
                  required
                />
              </div>
            ))}
          </div>
        )}
        {errors.eligibilityCriteria && (
          <span className="text-xs text-red-500">
            {errors.eligibilityCriteria.message ||
              errors.eligibilityCriteria.root?.message}
          </span>
        )}
      </div>

      <Input
        name="gradingTextUp"
        label="Grading Text Up"
        register={register}
        error={errors.gradingTextUp}
      />

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <label className="font-semibold">Grading System</label>
          <Button
            type="button"
            onClick={() =>
              setValue("gradingSystem", [
                ...gradingSystem,
                { letter: "", scale: "", point: "" },
              ])
            }
            className="flex items-center gap-2 rounded-md bg-primary px-3 py-1 text-sm text-white"
          >
            <FaPlus size={12} />
            Add Grading
          </Button>
        </div>
        {gradingSystem.length > 0 && (
          <div className="mt-2 border">
            {gradingSystem.map((grade, index) => (
              <div
                key={index}
                className="relative flex flex-col rounded-md border-b p-4 last:border-0"
              >
                <button
                  type="button"
                  onClick={() =>
                    setValue(
                      "gradingSystem",
                      gradingSystem.filter((_, i) => i !== index)
                    )
                  }
                  className="absolute right-4 top-4 text-lg font-bold text-red-500"
                >
                  ✕
                </button>
                <Input
                  name={`gradingSystem.${index}.letter`}
                  label={`Grade Letter ${index + 1}`}
                  placeholder="Enter letter grade"
                  register={register}
                  error={errors.gradingSystem?.[index]?.letter}
                  required
                />
                <Input
                  name={`gradingSystem.${index}.scale`}
                  label={`Grade Scale ${index + 1}`}
                  placeholder="Enter grading scale"
                  register={register}
                  error={errors.gradingSystem?.[index]?.scale}
                  required
                />
                <Input
                  name={`gradingSystem.${index}.point`}
                  label={`Grade Point ${index + 1}`}
                  placeholder="Enter grade point"
                  register={register}
                  error={errors.gradingSystem?.[index]?.point}
                  required
                />
              </div>
            ))}
          </div>
        )}
        {errors.gradingSystem && (
          <span className="text-xs text-red-500">
            {errors.gradingSystem.message || errors.gradingSystem.root?.message}
          </span>
        )}
      </div>

      <Input
        name="gradingTextDown"
        label="Grading Text Down"
        register={register}
        error={errors.gradingTextDown}
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

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <label className="font-semibold">Course Structure</label>
          <Button
            type="button"
            onClick={() =>
              setValue("courseStructure", [
                ...courseStructure,
                { subjects: [], electives: [] },
              ])
            }
            className="flex items-center gap-2 rounded-md bg-primary px-3 py-1 text-sm text-white"
          >
            <FaPlus size={12} />
            Add Semester
          </Button>
        </div>
        {courseStructure.length > 0 && (
          <div className="mt-2">
            {courseStructure.map((semester, semIndex) => (
              <div
                key={semIndex}
                className="relative mb-4 rounded-md border p-4"
              >
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      setValue(
                        "courseStructure",
                        courseStructure.filter((_, i) => i !== semIndex)
                      )
                    }
                    className="mb-10 flex items-center gap-2 rounded-md border px-4 py-2 text-sm hover:bg-gray-200"
                  >
                    <Trash className="h-4 w-4" />
                    Semester / Year
                  </button>
                </div>

                <Input
                  name={`courseStructure.${semIndex}.title`}
                  label={`Semester / Year Title`}
                  placeholder="Eg : Semester IV , Year 1"
                  register={register}
                  error={errors.courseStructure?.[semIndex].title}
                />
                {/* Subjects Subsection */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <label className="font-medium">Subjects</label>
                    <Button
                      type="button"
                      onClick={() => {
                        const currentSubjects = semester.subjects || [];
                        const updatedSemesters = [...courseStructure];
                        updatedSemesters[semIndex] = {
                          ...semester,
                          subjects: [
                            ...currentSubjects,
                            { code: "", title: "", marks: "" },
                          ],
                        };
                        setValue("courseStructure", updatedSemesters);
                      }}
                      className="flex items-center gap-2 rounded-md bg-secondary px-3 py-1 text-sm text-white"
                    >
                      <FaPlus size={12} />
                      Add Subject
                    </Button>
                  </div>
                  {semester.subjects &&
                    semester.subjects.map((subject, subIndex) => (
                      <div
                        key={subIndex}
                        className="relative mt-2 rounded-md border-b p-2 last:border-0"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            // Remove subject from this semester
                            const updatedSubjects = semester.subjects.filter(
                              (_, i) => i !== subIndex
                            );
                            const updatedSemesters = [...courseStructure];
                            updatedSemesters[semIndex] = {
                              ...semester,
                              subjects: updatedSubjects,
                            };
                            setValue("courseStructure", updatedSemesters);
                          }}
                          className="absolute right-2 top-2 text-red-500"
                        >
                          ✕
                        </button>
                        <Input
                          name={`courseStructure.${semIndex}.subjects.${subIndex}.code`}
                          label={`Subject Code ${subIndex + 1}`}
                          placeholder="Enter subject code"
                          register={register}
                          error={
                            errors.courseStructure?.[semIndex]?.subjects?.[
                              subIndex
                            ]?.code
                          }
                        />
                        <Input
                          name={`courseStructure.${semIndex}.subjects.${subIndex}.title`}
                          label={`Subject Title ${subIndex + 1}`}
                          placeholder="Enter subject title"
                          register={register}
                          error={
                            errors.courseStructure?.[semIndex]?.subjects?.[
                              subIndex
                            ]?.title
                          }
                        />
                        <Input
                          name={`courseStructure.${semIndex}.subjects.${subIndex}.marks`}
                          label={`Subject Marks ${subIndex + 1}`}
                          placeholder="Enter subject marks"
                          register={register}
                          error={
                            errors.courseStructure?.[semIndex]?.subjects?.[
                              subIndex
                            ]?.marks
                          }
                          type="number"
                        />
                      </div>
                    ))}
                </div>

                {/* Electives Subsection */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="font-medium">Electives</label>
                    <Button
                      type="button"
                      onClick={() => {
                        const currentElectives = semester.electives || [];
                        const updatedSemesters = [...courseStructure];
                        updatedSemesters[semIndex] = {
                          ...semester,
                          electives: [...currentElectives, ""],
                        };
                        setValue("courseStructure", updatedSemesters);
                      }}
                      className="flex items-center gap-2 rounded-md bg-secondary px-3 py-1 text-sm text-white"
                    >
                      <FaPlus size={12} />
                      Add Elective
                    </Button>
                  </div>
                  {semester.electives &&
                    semester.electives.map((elective, elecIndex) => (
                      <div
                        key={elecIndex}
                        className="relative mt-2 rounded-md border-b p-2 last:border-0"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            const updatedElectives = semester.electives.filter(
                              (_, i) => i !== elecIndex
                            );
                            const updatedSemesters = [...courseStructure];
                            updatedSemesters[semIndex] = {
                              ...semester,
                              electives: updatedElectives,
                            };
                            setValue("courseStructure", updatedSemesters);
                          }}
                          className="absolute right-2 top-2 text-red-500"
                        >
                          ✕
                        </button>
                        <Input
                          name={`courseStructure.${semIndex}.electives.${elecIndex}`}
                          label={`Elective ${elecIndex + 1}`}
                          placeholder="Enter elective name"
                          register={register}
                          error={
                            errors.courseStructure?.[semIndex]?.electives?.[
                              elecIndex
                            ]
                          }
                        />
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {errors.courseStructure && (
          <span className="text-xs text-red-500">
            {errors.courseStructure.message ||
              errors.courseStructure.root?.message}
          </span>
        )}
      </div>

      <FaqInput
        setValue={setValue}
        register={register}
        errors={errors}
        watch={watch}
      />

      {/* Form Actions */}
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
