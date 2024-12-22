"use client";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SetStateAction, useState } from "react";

type SelectInputProps<T> = {
  defaultValue?: string;
  array: T[];
  name: string;
  setSelected: (value: SetStateAction<string | null>) => void;
};

function makeFirstLetterLowerCase(str: string): string {
  if (str.length === 0) return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function addSpaceBeforeCapitalsAndLowercase(str: string): string {
  return str.replace(/([A-Z])/g, " $1").toLowerCase();
}

function addSpaceBeforeCapitals(str: string): string {
  return str.replace(/([A-Z])/g, " $1");
}

export default function SelectInput<T>({
  defaultValue = "",
  array,
  name,
  setSelected,
}: SelectInputProps<T>) {
  const [query, setQuery] = useState<string>("");

  const filtered = array.filter((item) => {
    const propertyName = `${name}Name` as keyof T;
    const propertyValue = item[propertyName as keyof T] as string;
    return (
      propertyValue &&
      propertyValue.toLowerCase().startsWith(query.toLowerCase())
    );
  });

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {addSpaceBeforeCapitals(name)}
      </label>
      <Select
        name={makeFirstLetterLowerCase(name)}
        onValueChange={(value) => setSelected(value)}
        defaultValue={defaultValue}
      >
        <SelectTrigger className="w-full">
          <SelectValue
            placeholder={`Select ${addSpaceBeforeCapitalsAndLowercase(name)}`}
          />
        </SelectTrigger>
        <SelectContent>
          <div
            className="px-2 py-1"
            onClick={(e) => e.stopPropagation()} // Prevents `Select` focus handling
          >
            <Input
              placeholder="Type to search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()} // Prevents key events from propagating to `Select`
            />
          </div>
          {filtered.map((item) => (
            <SelectItem
              key={item[`${name}ID` as keyof T] as string}
              value={item[`${name}Name` as keyof T] as string}
            >
              {item[`${name}Name` as keyof T] as string}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
