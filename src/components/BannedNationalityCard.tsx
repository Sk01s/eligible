import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // ShadCN button component
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // ShadCN dialog components
import EditBannedForm from "./EditBannedForm"; // Import the EditBannedForm component
import {
  AccountStationOption,
  AccountType,
  BannedNationalityView,
  Nationality,
} from "@/db/dbTypes";
import { deleteBannedNationality } from "@/app/actions/bannedNationalityActions";

interface BannedNationalityCardProps {
  data: BannedNationalityView;
  accountStationOptions: AccountStationOption[];
  nationalities: Nationality[];
  accountTypes: AccountType[];
  onDelete: () => void;
}

export default function BannedNationalityCard({
  data,
  accountStationOptions,
  nationalities,
  accountTypes,
  onDelete,
}: BannedNationalityCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false); // State for edit modal
  const [isDeleteOpen, setIsDeleteOpen] = useState(false); // State for delete modal
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // State for error handling

  const handleDelete = async () => {
    try {
      setErrorMessage(null); // Clear any previous error messages
      await deleteBannedNationality(data.BannedNationalityID); // Call the delete function
      setIsDeleteOpen(false); // Close the modal on success
      onDelete();
    } catch {
      // Set the error message if the delete function fails
      setErrorMessage(
        "Failed to delete the banned nationality. Please try again later."
      );
    }
  };

  return (
    <div className="relative border rounded-lg p-4 shadow-sm bg-white">
      {/* Buttons for Edit and Delete */}
      <div className="absolute top-2 right-2 sm:top-[50%] sm:right-2 sm:-translate-y-[50%] flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setIsDeleteOpen(true)}
        >
          Delete
        </Button>
      </div>

      {/* Content Display */}
      <div className="flex flex-col gap-2 lg:gap-8 lg:flex-row lg:items-center">
        {/* <div className="sm:flex-1 flex items-center gap-2 text-sm max-w-fit">
          <p className="font-semibold text-gray-600">ID :</p>
          <p className="font-bold">{data.BannedNationalityID}</p>
        </div>

        <div className="sm:flex-1 flex items-center gap-2 text-sm max-w-fit">
          <p className="font-semibold text-gray-600">Date :</p>
          <p className="font-bold">{data.BannedNationalityDate}</p>
        </div> */}

        <div className="sm:flex-1 flex items-center gap-2 text-sm max-w-fit">
          <p className="font-semibold text-gray-600">Nationality :</p>
          <p className="font-bold">{data.NationalityName}</p>
        </div>

        <div className="sm:flex-1 flex items-center gap-2 text-sm max-w-fit">
          <p className="font-semibold text-gray-600">Station Option :</p>
          <p className="font-bold">{data.AccountStationOptionName}</p>
        </div>

        <div className="sm:flex-1 flex items-center gap-2 text-sm max-w-fit">
          <p className="font-semibold text-gray-600">Account Type :</p>
          <p className="font-bold">{data.AccountTypeName}</p>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Banned Nationality</DialogTitle>
          </DialogHeader>
          {/* Use EditBannedForm */}
          <EditBannedForm
            bannedName="Nationality"
            openDialog={isEditOpen ? "Nationality" : ""}
            handleCloseDialog={() => {
              setIsEditOpen(false);
              onDelete();
            }}
            countries={[]} // Pass an empty array if not applicable
            nationalities={nationalities}
            accountTypes={accountTypes}
            continents={[]} // Pass an empty array if not applicable
            accountStationOptions={accountStationOptions}
            initialData={{
              selected: data.NationalityName,
              selectedAccountType: data.AccountTypeName,
              selectedAccountStationOption: data.AccountStationOptionName,
            }}
            id={data.BannedNationalityID}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Banned Nationality</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete{" "}
            <span className="font-bold">{data.NationalityName}</span> from the
            banned list? This action cannot be undone.
          </p>
          {errorMessage && (
            <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
          )}
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Confirm Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
