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

// Generic type for SelectInputProps
type SelectInputProps<T> = {
  defaultValue?: string;
  array: T[]; // Array of any object type
  name: string; // Property name to filter by (e.g., 'Country', 'Nationality', etc.)
  setSelected: (value: SetStateAction<string | null>) => void; // Function to set selected value
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

// Handle arrays of different object types (Country, Continent, Nationality)
export default function SelectInput<T>({
  defaultValue = "",
  array,
  name,
  setSelected,
}: SelectInputProps<T>) {
  const [query, setQuery] = useState<string>("");

  // Filter the array based on the dynamic property name
  const filtered = array.filter((item) => {
    const propertyName = `${name}Name` as keyof T; // Ensure the property exists on the object

    const propertyValue = item[propertyName as keyof T] as string; // Access the property dynamically
    return (
      propertyValue && propertyValue.toLowerCase().includes(query.toLowerCase())
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
          <div className="px-2 py-1">
            <Input
              placeholder="Type to search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
