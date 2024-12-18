"use client";

import { Button } from "@/components/ui/button"; // ShadCN Button component
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // ShadCN Dialog components

import { useEffect, useState } from "react";
import {
  AccountStationOption,
  AccountType,
  Continent,
  Country,
  Nationality,
} from "@/db/dbTypes";
import SelectInput from "./SelectInput";
import { addBan } from "@/app/actions/formActions";

// Define the AddBannedForm props with strict types
type AddBannedFormProps = {
  bannedName: "Country" | "Nationality" | "Continent"; // Explicitly type bannedName
  openDialog: string;
  handleCloseDialog: () => void;
  countries: Country[];
  nationalities: Nationality[];
  accountTypes: AccountType[];
  continents: Continent[];
  accountStationOptions?: AccountStationOption[];
  onAdd: () => void;
};

export default function AddBannedForm({
  bannedName,
  openDialog,
  handleCloseDialog,
  countries = [],
  nationalities = [],
  accountTypes = [],
  continents = [],
  accountStationOptions = [],
  onAdd,
}: AddBannedFormProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedAccountTypes, setSelectedAccountTypes] = useState<
    string | null
  >(null);
  const [selectedAccountStationOption, setSelectedAccountStationOption] =
    useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Track form submission state

  useEffect(() => {
    const isValid =
      selected && selectedAccountTypes && selectedAccountStationOption;
    setIsFormValid(!!isValid); // Ensure all fields are selected
  }, [selected, selectedAccountStationOption, selectedAccountTypes]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true); // Disable the form while submitting
    setErrorMessage(null); // Clear previous error messages

    const formData = new FormData(event.target as HTMLFormElement); // Get form data
    try {
      await addBan({ bannedName, formData }); // Call the server action
      handleCloseDialog(); // Close the dialog on success
      onAdd();
    } catch (error) {
      // Display the error message
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    } finally {
      setIsSubmitting(false); // Re-enable the form
    }
  };

  return (
    <Dialog open={openDialog === bannedName} onOpenChange={handleCloseDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Banned {bannedName}</DialogTitle>
          <DialogDescription>
            Enter the name of the {bannedName} you want to ban.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <SelectInput
            array={accountStationOptions}
            name="AccountStationOption"
            setSelected={setSelectedAccountStationOption}
          />
          <SelectInput
            array={accountTypes} // AccountType[] should always be passed here
            name={"AccountType"}
            setSelected={setSelectedAccountTypes}
          />

          {/* Conditionally render SelectInput for Country, Nationality, or Continent */}
          {bannedName === "Country" && (
            <SelectInput
              array={countries}
              name={"Country"}
              setSelected={setSelected}
            />
          )}
          {bannedName === "Continent" && (
            <SelectInput
              array={continents}
              name={"Continent"}
              setSelected={setSelected}
            />
          )}
          {bannedName === "Nationality" && (
            <SelectInput
              array={nationalities}
              name={"Nationality"}
              setSelected={setSelected}
            />
          )}

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={!isFormValid || isSubmitting}>
              Add {bannedName}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
