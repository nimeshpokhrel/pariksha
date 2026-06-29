"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function ComboboxInput({
  name,
  label,
  options,
  register,
  required,
  error,
  placeholder,
  setValue,
  className,
  defaultValue = "",
}) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(defaultValue);
  const [search, setSearch] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);

  const handleSelect = (currentValue) => {
    setValue(name, currentValue);
    setInputValue(currentValue);
    setOpen(false);
  };

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredOptions(options);
      return;
    }
    const filterOptions = options.filter((option) =>
      option.label.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredOptions(filterOptions);
  }, [search, options]);

  return (
    <div className={`w-full ${className}`}>
      <label className="mb-1 pl-2 text-xs text-gray-500">
        {label}
        {required ? " *" : ""}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="mt-1.5 w-full justify-between"
          >
            {inputValue
              ? options.find((option) => option.value === inputValue)?.label
              : placeholder || "Select option..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="z-[9999] max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0 shadow-xl"
          forceMount
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={placeholder || "Search option..."}
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        inputValue === option.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <input type="hidden" {...register(name, { required })} />
      <div className="h-6">
        {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
      </div>
    </div>
  );
}
