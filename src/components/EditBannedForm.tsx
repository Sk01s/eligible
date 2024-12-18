"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import {
  AccountStationOption,
  AccountType,
  Continent,
  Country,
  Nationality,
} from "@/db/dbTypes";
import SelectInput from "./SelectInput";
import { editBan } from "@/app/actions/formActions"; // Replace with your edit action logic

type EditBannedFormProps = {
  bannedName: "Country" | "Nationality" | "Continent";
  openDialog: string;
  handleCloseDialog: () => void;
  countries: Country[];
  nationalities: Nationality[];
  accountTypes: AccountType[];
  continents: Continent[];
  accountStationOptions?: AccountStationOption[];
  initialData: {
    selected: string;
    selectedAccountType: string;
    selectedAccountStationOption: string;
  }; // Pre-fill data for the form
  id: number;
};

export default function EditBannedForm({
  bannedName,
  openDialog,
  handleCloseDialog,
  countries = [],
  nationalities = [],
  accountTypes = [],
  continents = [],
  accountStationOptions = [],
  initialData,
  id,
}: EditBannedFormProps) {
  const [selected, setSelected] = useState<string | null>(
    initialData?.selected || null
  );
  const [selectedAccountTypes, setSelectedAccountTypes] = useState<
    string | null
  >(initialData?.selectedAccountType || null);
  const [selectedAccountStationOption, setSelectedAccountStationOption] =
    useState<string | null>(initialData?.selectedAccountStationOption || null);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const isValid =
      selected && selectedAccountTypes && selectedAccountStationOption;
    setIsFormValid(!!isValid);
  }, [selected, selectedAccountStationOption, selectedAccountTypes]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData(event.target as HTMLFormElement);
    try {
      await editBan({ bannedName, formData, id }); // Call the server edit action
      handleCloseDialog(); // Close the dialog on success
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={openDialog === bannedName} onOpenChange={handleCloseDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Banned {bannedName}</DialogTitle>
          <DialogDescription>
            Modify the details of the {bannedName}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <SelectInput
            array={accountStationOptions}
            name="AccountStationOption"
            setSelected={setSelectedAccountStationOption}
            defaultValue={initialData.selectedAccountStationOption} // Pre-fill value
          />
          <SelectInput
            array={accountTypes}
            name={"AccountType"}
            setSelected={setSelectedAccountTypes}
            defaultValue={initialData.selectedAccountType} // Pre-fill value
          />

          {/* Conditional inputs for banned item */}
          {bannedName === "Country" && (
            <SelectInput
              array={countries}
              name={"Country"}
              setSelected={setSelected}
              defaultValue={initialData.selected} // Pre-fill value
            />
          )}
          {bannedName === "Continent" && (
            <SelectInput
              array={continents}
              name={"Continent"}
              setSelected={setSelected}
              defaultValue={initialData.selected} // Pre-fill value
            />
          )}
          {bannedName === "Nationality" && (
            <SelectInput
              array={nationalities}
              name={"Nationality"}
              setSelected={setSelected}
              defaultValue={initialData.selected} // Pre-fill value
            />
          )}

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={!isFormValid || isSubmitting}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
