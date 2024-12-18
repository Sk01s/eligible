export interface CountryInput {
  Code: string;
  CountryName: string;
  ContinentID: number; // Added ContinentID
}

export interface Continent {
  ContinentName: string;
  ContinentID: number;
}

export interface ContinentInput {
  ContinentName: string;
}

export interface NationalityInput {
  NationalityName: string;
}

export interface AccountStationOptionInput {
  AccountStationOptionName: string; // Changed field name
}

export interface Country {
  CountryID: number;
  Code: string;
  CountryName: string;
  ContinentID: number; // Added ContinentID
}

export interface Nationality {
  NationalityID: number;
  NationalityName: string;
}

export interface AccountStationOption {
  AccountStationOptionID: number;
  AccountStationOptionName: string; // Changed field name
}

export interface AccountTypeInput {
  AccountTypeName: string;
}

export interface AccountType {
  AccountTypeID: number;
  AccountTypeName: string;
}

export interface BannedCountry {
  BannedCountryID: number;
  BannedCountryDate: string; // Use ISO string for dates
  AccountStationOptionID: number;
  CountryID: number;
  AccountTypeID: number;
}

export interface BannedCountryInput {
  BannedCountryDate: string; // Use ISO string for dates
  AccountStationOptionID: number;
  CountryID: number;
  AccountTypeID: number;
}

export interface BannedCountryView {
  BannedCountryID: number;
  BannedCountryDate: string;
  AccountStationOptionID: number;
  AccountStationOptionName: string; // Updated field name
  CountryID: number;
  CountryName: string; // From Countries table
  AccountTypeID: number;
  AccountTypeName: string; // From AccountTypes table
}

export interface BannedContinent {
  BannedContinentID: number;
  BannedContinentDate: string; // ISO string
  AccountStationOptionID: number;
  ContinentID: number;
  AccountTypeID: number | null; // Nullable
}

export interface BannedContinentInput {
  BannedContinentDate: string; // ISO string
  AccountStationOptionID: number;
  ContinentID: number;
  AccountTypeID?: number; // Optional (nullable column)
}

export interface BannedContinentView {
  BannedContinentID: number;
  BannedContinentDate: string;
  AccountStationOptionID: number;
  AccountStationOptionName: string; // Updated field name
  ContinentID: number;
  ContinentName: string;
  AccountTypeID: number | null;
  AccountTypeName: string | null;
}

export interface BannedNationality {
  BannedNationalityID: number;
  BannedNationalityDate: string; // Use ISO string format for dates
  NationalityID: number;
  AccountStationOptionID: number;
  AccountTypeID: number;
}

export interface BannedNationalityInput {
  BannedNationalityDate: string; // Use ISO string format for dates
  NationalityID: number;
  AccountStationOptionID: number;
  AccountTypeID: number;
}

export interface BannedNationalityView {
  BannedNationalityID: number;
  BannedNationalityDate: string;
  NationalityID: number;
  NationalityName: string;
  AccountStationOptionID: number;
  AccountStationOptionName: string; // Updated field name
  AccountTypeID: number;
  AccountTypeName: string;
}
