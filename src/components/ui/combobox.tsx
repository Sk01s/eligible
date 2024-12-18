// import { cn } from "@/lib/utils";
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from "@radix-ui/react-popover";
// import {
//   CommandInput,
//   CommandList,
//   CommandEmpty,
//   CommandGroup,
//   CommandItem,
// } from "cmdk";
// import { ChevronsUpDown, Command, Check } from "lucide-react";
// import React from "react";
// import { Button } from "./button";

// export function ComboboxDemo({
//   options,
//   placeholder,
//   selectedValue,
//   onSelect,
// }: {
//   options: { value: string; label: string }[];
//   placeholder: string;
//   selectedValue: string | null;
//   onSelect: (value: string | null) => void;
// }) {
//   const [open, setOpen] = React.useState(false);

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           role="combobox"
//           aria-expanded={open}
//           className="w-full justify-between"
//         >
//           {selectedValue
//             ? options.find((option) => option.value === selectedValue)?.label
//             : placeholder}
//           <ChevronsUpDown className="opacity-50" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-full p-0">
//         <Command>
//           <CommandInput placeholder="Search..." />
//           <CommandList>
//             <CommandEmpty>No options found.</CommandEmpty>
//             <CommandGroup>
//               {options.map((option) => (
//                 <CommandItem
//                   key={option.value}
//                   value={option.value}
//                   onSelect={(value) => {
//                     onSelect(value === selectedValue ? null : value);
//                     setOpen(false);
//                   }}
//                 >
//                   {option.label}
//                   <Check
//                     className={cn(
//                       "ml-auto",
//                       selectedValue === option.value
//                         ? "opacity-100"
//                         : "opacity-0"
//                     )}
//                   />
//                 </CommandItem>
//               ))}
//             </CommandGroup>
//           </CommandList>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// }
