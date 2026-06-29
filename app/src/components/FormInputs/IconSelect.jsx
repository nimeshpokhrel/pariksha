import Select from "react-select";
import { icons as careerOptions } from "@/data/icons";

export default function IconSelect({
  name,
  type,
  label,
  register,
  error,
  defaultValue,
  required,
  noError,
  setValue,
  ...props
}) {
  const findOptionByValue = (value) => {
    return careerOptions
      .flatMap((group) => group.options)
      .find((option) => option.value === value);
  };

  return (
    <>
      <input id={name} {...register(name)} className="hidden" />
      <label htmlFor={name} className="mb-1 pl-2 text-xs text-gray-500">
        {label}
        {required ? " *" : ""}
      </label>
      <Select
        onChange={(val) => {
          setValue(name, val.value);
        }}
        defaultValue={findOptionByValue(defaultValue)}
        options={careerOptions}
        className="w-full"
        classNames={{
          control: () => "p-0 border-2",
          option: () => "p-0 hover:bg-gray-100",
        }}
        formatOptionLabel={(option) => (
          <div className="flex items-center gap-2">
            {option.icon}
            {option.label}
          </div>
        )}
        formatGroupLabel={(group) => (
          <div className="text-sm font-bold text-gray-500">
            {group.category}
          </div>
        )}
        isOptionDisabled={(option) => option.options}
        {...props}
      />
      <div className="h-6">
        {error && <span className="text-xs text-red-500">{error.message}</span>}
      </div>
    </>
  );
}
