import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function DatePicker({ name, register, setValue, watch, error }) {
  const value = watch(name);

  return (
    <>
      <input id={name} {...register(name)} className="hidden" />
      <Popover className="w-auto p-0">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(new Date(value), "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="z-[9999] w-auto p-0" forceMount>
          <Calendar
            mode="single"
            selected={value ? new Date(value) : undefined}
            onSelect={(date) => {
              if (date) {
                setValue(name, date);
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <div className="h-6">
        {error && <span className="text-xs text-red-500">{error.message}</span>}
      </div>
    </>
  );
}
