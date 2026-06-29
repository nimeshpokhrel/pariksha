"use client";

import { useState, useEffect, useMemo } from "react";
import { X, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Checkbox } from "@/components/ui/checkbox";

export function MultiSelectCombobox({
  name,
  label,
  options, // flat array of { value, label, group, groupLabel }
  setValue,
  register,
  error,
  placeholder,
  defaultValue,
  className,
  required,
}) {
  const [open, setOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [search, setSearch] = useState("");

  const groupedOptions = useMemo(() => {
    const map = new Map();
    options.forEach((opt) => {
      const key = opt.group || opt.groupLabel;
      if (!map.has(key)) {
        map.set(key, { label: opt.groupLabel, options: [] });
      }
      map.get(key).options.push({ value: opt.value, label: opt.label });
    });
    return Array.from(map.values());
  }, [options]);

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groupedOptions;
    const term = search.toLowerCase();
    return groupedOptions
      .map((grp) => ({
        label: grp.label,
        options: grp.options.filter((opt) =>
          opt.label.toLowerCase().includes(term)
        ),
      }))
      .filter((grp) => grp.options.length > 0);
  }, [search, groupedOptions]);

  useEffect(() => {
    if (defaultValue) {
      setSelectedValues(defaultValue);
    }
  }, [defaultValue]);

  const handleSelect = (value) => {
    const newVals = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    setSelectedValues(newVals);
    setValue(name, newVals);
  };

  const handleRemove = (value) => {
    const newVals = selectedValues.filter((v) => v !== value);
    setSelectedValues(newVals);
    setValue(name, newVals);
  };

  return (
    <div className={`w-full ${className}`}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
        {required && "*"}
      </label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="mt-1.5 h-auto min-h-[2.5rem] w-full justify-between py-2"
          >
            <div className="flex flex-wrap gap-1">
              {selectedValues.length > 0
                ? selectedValues.map((val) => {
                    const opt = options.find((o) => o.value === val);
                    return (
                      <Badge key={val} variant="secondary" className="mr-1">
                        {opt?.label}
                        <button
                          className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onClick={() => handleRemove(val)}
                        >
                          <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </button>
                      </Badge>
                    );
                  })
                : placeholder || "Select options..."}
            </div>
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="z-[9999] max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0 shadow-xl"
          forceMount
        >
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={placeholder || "Search options..."}
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>

              {filteredGroups.map((grp) => (
                <CommandGroup key={grp.label} heading={grp.label}>
                  {grp.options.map((opt) => (
                    <CommandItem
                      key={opt.value}
                      value={opt.value}
                      onSelect={() => handleSelect(opt.value)}
                    >
                      <Checkbox
                        checked={selectedValues.includes(opt.value)}
                        className="mr-2"
                      />
                      {opt.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <input type="hidden" {...register(name, { required })} />
      {error && (
        <p className="mt-1 text-sm font-medium text-destructive">
          {error.message}
        </p>
      )}
    </div>
  );
}
