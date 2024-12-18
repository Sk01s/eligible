"use server"; // Enable server action
import { formSchemaEligible } from "@/app/actions/formSchema";
import { z } from "zod";
import {
  insertBannedContinent,
  updateBannedContinent,
} from "@/app/actions/bannedContinentActions";
import {
  insertBannedCountry,
  updateBannedCountry,
} from "@/app/actions/bannedCountryActions";
import {
  insertBannedNationality,
  updateBannedNationality,
} from "@/app/actions/bannedNationalityActions";

import { getAllAccountStationOptions } from "./accountStationOptionAction";
import { getAllAccountTypes } from "./accountTypesActions";
import { getAllContinents } from "./continentActions";
import { getAllCountries } from "./countryActions";
import { getAllNationalities } from "./nationalityActions";
import { handleDBError } from "@/lib/utils";
import { getAllAccountStationOptionsDataAccess } from "@/db/accountStationOption";
import { isContinentAccountBanned } from "@/db/bannedContinent";
import { isCountryAccountBanned } from "@/db/bannedCountry";
import { isNationalityAccountBanned } from "@/db/bannedNationality";
export const submitFormEligible = async (
  formData: FormData
): Promise<{
  success: boolean;
  errors: {
    [x: string]: string[] | string | undefined;
    [x: number]: string[] | undefined;
    [x: symbol]: string[] | undefined;
  } | null;
  data:
    | {
        AccountStationOptionName: string;
        AccountStationOptionID: number;
        isContinentAccountBanned: boolean;
        isCountryAccountBanned: boolean;
        isNationalityAccountBanned: boolean;
        error?: undefined;
      }[]
    | null;
}> => {
  try {
    // Convert FormData to a plain object
    const data = Object.fromEntries(formData.entries());
    // Validate data using the Zod schema
    const validatedData = formSchemaEligible.parse(data);

    // Fetch account station options
    const accountStationOptions = await getAllAccountStationOptionsDataAccess();

    // Helper function to safely process each option
    const processAccountStationOption = async (
      AccountStationOptionID: number,
      AccountStationOptionName: string
    ) => {
      try {
        return {
          AccountStationOptionName,
          AccountStationOptionID,
          isContinentAccountBanned: await isContinentAccountBanned({
            AccountStationOptionID,
            AccountTypeName: validatedData.accountType,
            CountryName: validatedData.country,
          }),
          isCountryAccountBanned: await isCountryAccountBanned({
            AccountStationOptionID,
            AccountTypeName: validatedData.accountType,
            CountryName: validatedData.country,
          }),
          isNationalityAccountBanned: await isNationalityAccountBanned({
            AccountStationOptionID,
            AccountTypeName: validatedData.accountType,
            NationalityName: validatedData.nationality,
          }),
        };
      } catch (err) {
        // Capture specific errors for this option
        console.error(
          `Error processing AccountStationOptionID: ${AccountStationOptionID}`,
          err
        );
        return { AccountStationOptionID, error: err }; // Return the error for logging or debugging
      }
    };

    // Process all options safely
    const validAccountStationOptions = await Promise.all(
      accountStationOptions.map(
        ({ AccountStationOptionID, AccountStationOptionName }) =>
          processAccountStationOption(
            AccountStationOptionID,
            AccountStationOptionName
          )
      )
    );

    const failedOption = validAccountStationOptions.find(
      (option) => option.error
    );

    if (failedOption) {
      // Return error if any failed option exists
      return {
        success: false,
        errors: {
          general: `Failed to check AccountStationOptionID: ${failedOption.AccountStationOptionID}`,
        },
        data: null,
      };
    }

    // Filter out the valid options
    const successfulOptions = validAccountStationOptions.filter(
      (
        option
      ): option is {
        AccountStationOptionName: string;
        AccountStationOptionID: number;
        isContinentAccountBanned: boolean;
        isCountryAccountBanned: boolean;
        isNationalityAccountBanned: boolean;
      } => !option.error
    );

    // Return successful result
    return {
      success: true,
      errors: null,
      data: successfulOptions,
    };
  } catch (error) {
    // Handle validation errors or general errors
    if (error instanceof z.ZodError) {
      const flatErrors = error.flatten();
      return { success: false, errors: flatErrors.fieldErrors, data: null };
    }
    console.error("Unexpected error:", error);
    return {
      success: false,
      errors: { general: "An unexpected error occurred." },
      data: null,
    };
  }
};

export const submitFormLoginIn = async (formData: FormData) => {
  const email = formData.get("email");
  const password = formData.get("password");
  if (password === process.env.PASSWORD && email === process.env.EMAIL) {
    return { success: true, ID: process.env.ID };
  } else {
    return { success: false, ID: null };
  }
};
type banProps = {
  formData: FormData;
  bannedName: string;
};
type editbanProps = {
  formData: FormData;
  bannedName: string;
  id: number;
};

export async function addBan({ formData, bannedName }: banProps) {
  const countries = await getAllCountries();
  const nationalities = await getAllNationalities();
  const accountTypes = await getAllAccountTypes();
  const continents = await getAllContinents();
  const accountStationOptions = await getAllAccountStationOptions();

  const accountStationOption = accountStationOptions.find(
    (option) =>
      option.AccountStationOptionName ===
      formData.get("accountStationOption")?.toString()
  );
  const accountType = accountTypes.find(
    (type) => type.AccountTypeName === formData.get("accountType")?.toString()
  );

  try {
    switch (bannedName) {
      case "Continent":
        const continent = continents.find(
          (c) => c.ContinentName === formData.get("continent")?.toString()
        );
        if (!continent) throw new Error("Continent not found.");

        await insertBannedContinent({
          AccountStationOptionID:
            accountStationOption?.AccountStationOptionID || 0,
          AccountTypeID: accountType?.AccountTypeID || 0,
          ContinentID: continent.ContinentID,
        });
        break;

      case "Country":
        const country = countries.find(
          (c) => c.CountryName === formData.get("country")?.toString()
        );
        if (!country) throw new Error("Country not found.");

        await insertBannedCountry({
          AccountStationOptionID:
            accountStationOption?.AccountStationOptionID || 0,
          AccountTypeID: accountType?.AccountTypeID || 0,
          CountryID: country.CountryID,
        });
        break;

      case "Nationality":
        const nationality = nationalities.find(
          (n) => n.NationalityName === formData.get("nationality")?.toString()
        );
        if (!nationality) throw new Error("Nationality not found.");

        await insertBannedNationality({
          AccountStationOptionID:
            accountStationOption?.AccountStationOptionID || 0,
          AccountTypeID: accountType?.AccountTypeID || 0,
          NationalityID: nationality.NationalityID,
        });
        break;

      default:
        throw new Error("Invalid bannedName provided.");
    }

    return { success: true };
  } catch (error) {
    // Use handleDBError for all database-related or unexpected errors
    await handleDBError(error);
  }
}
export async function editBan({ formData, bannedName, id }: editbanProps) {
  const countries = await getAllCountries();
  const nationalities = await getAllNationalities();
  const accountTypes = await getAllAccountTypes();
  const continents = await getAllContinents();
  const accountStationOptions = await getAllAccountStationOptions();

  const accountStationOption = accountStationOptions.find(
    (option) =>
      option.AccountStationOptionName ===
      formData.get("accountStationOption")?.toString()
  );
  const accountType = accountTypes.find(
    (type) => type.AccountTypeName === formData.get("accountType")?.toString()
  );

  try {
    switch (bannedName) {
      case "Continent":
        const continent = continents.find(
          (c) => c.ContinentName === formData.get("continent")?.toString()
        );
        if (!continent) throw new Error("Continent not found.");

        await updateBannedContinent(id, {
          AccountStationOptionID:
            accountStationOption?.AccountStationOptionID || 0,
          AccountTypeID: accountType?.AccountTypeID || 0,
          ContinentID: continent.ContinentID,
        });
        break;

      case "Country":
        const country = countries.find(
          (c) => c.CountryName === formData.get("country")?.toString()
        );
        if (!country) throw new Error("Country not found.");

        await updateBannedCountry(id, {
          AccountStationOptionID:
            accountStationOption?.AccountStationOptionID || 0,
          AccountTypeID: accountType?.AccountTypeID || 0,
          CountryID: country.CountryID,
        });
        break;

      case "Nationality":
        const nationality = nationalities.find(
          (n) => n.NationalityName === formData.get("nationality")?.toString()
        );
        if (!nationality) throw new Error("Nationality not found.");

        await updateBannedNationality(id, {
          AccountStationOptionID:
            accountStationOption?.AccountStationOptionID || 0,
          AccountTypeID: accountType?.AccountTypeID || 0,
          NationalityID: nationality.NationalityID,
        });
        break;

      default:
        throw new Error("Invalid bannedName provided.");
    }

    return { success: true };
  } catch (error) {
    // Use handleDBError for all database-related or unexpected errors
    await handleDBError(error);
  }
}
