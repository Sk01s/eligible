import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { viewAllBannedCountries } from "@/app/actions/bannedCountryActions";
import { getAllCountries } from "@/app/actions/countryActions";
import { getAllAccountTypes } from "@/app/actions/accountTypesActions";
import { getAllNationalities } from "@/app/actions/nationalityActions";
import { getAllContinents } from "@/app/actions/continentActions";
import { getAllAccountStationOptions } from "@/app/actions/accountStationOptionAction";
import { viewAllBannedContinents } from "@/app/actions/bannedContinentActions";
import { viewAllBannedNationalities } from "@/app/actions/bannedNationalityActions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
function isSQLiteError(
  error: unknown
): error is { code: string; message: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string" &&
    typeof (error as { code: unknown }).code === "string"
  );
}

class DatabaseError extends Error {
  constructor(public code?: string, message?: string) {
    super(message);
    this.name = "DatabaseError";
  }
}

export async function handleDBError(error: unknown): Promise<never> {
  if (isSQLiteError(error)) {
    console.error("SQLite error:", error.message);
    throw new DatabaseError(error.code, `SQLite Error: ${error.message}`);
  } else if (error instanceof Error) {
    console.error("Unexpected error:", error.message);
    throw new DatabaseError(undefined, `Unexpected Error: ${error.message}`);
  } else {
    console.error("Unknown error:", error);
    throw new DatabaseError(undefined, "An unknown error occurred");
  }
}

export const UN_CERTIFIED_COUNTRIES: {
  code: string;
  countryName: string;
  nationalityName: string;
  continentID: number;
}[] = [
  {
    code: "AFG",
    countryName: "Afghanistan",
    nationalityName: "Afghan",
    continentID: 3,
  },
  {
    code: "ALB",
    countryName: "Albania",
    nationalityName: "Albanian",
    continentID: 4,
  },
  {
    code: "DZA",
    countryName: "Algeria",
    nationalityName: "Algerian",
    continentID: 1,
  },
  {
    code: "AND",
    countryName: "Andorra",
    nationalityName: "Andorran",
    continentID: 4,
  },
  {
    code: "AGO",
    countryName: "Angola",
    nationalityName: "Angolan",
    continentID: 1,
  },
  {
    code: "ATG",
    countryName: "Antigua and Barbuda",
    nationalityName: "Antiguan or Barbudan",
    continentID: 5,
  },
  {
    code: "ARG",
    countryName: "Argentina",
    nationalityName: "Argentine",
    continentID: 7,
  },
  {
    code: "ARM",
    countryName: "Armenia",
    nationalityName: "Armenian",
    continentID: 3,
  },
  {
    code: "AUS",
    countryName: "Australia",
    nationalityName: "Australian",
    continentID: 6,
  },
  {
    code: "AUT",
    countryName: "Austria",
    nationalityName: "Austrian",
    continentID: 4,
  },
  {
    code: "AZE",
    countryName: "Azerbaijan",
    nationalityName: "Azerbaijani",
    continentID: 3,
  },
  {
    code: "BHS",
    countryName: "Bahamas",
    nationalityName: "Bahamian",
    continentID: 5,
  },
  {
    code: "BHR",
    countryName: "Bahrain",
    nationalityName: "Bahraini",
    continentID: 3,
  },
  {
    code: "BGD",
    countryName: "Bangladesh",
    nationalityName: "Bangladeshi",
    continentID: 3,
  },
  {
    code: "BRB",
    countryName: "Barbados",
    nationalityName: "Barbadian",
    continentID: 5,
  },
  {
    code: "BLR",
    countryName: "Belarus",
    nationalityName: "Belarusian",
    continentID: 4,
  },
  {
    code: "BEL",
    countryName: "Belgium",
    nationalityName: "Belgian",
    continentID: 4,
  },
  {
    code: "BLZ",
    countryName: "Belize",
    nationalityName: "Belizean",
    continentID: 5,
  },
  {
    code: "BEN",
    countryName: "Benin",
    nationalityName: "Beninese",
    continentID: 1,
  },
  {
    code: "BTN",
    countryName: "Bhutan",
    nationalityName: "Bhutanese",
    continentID: 3,
  },
  {
    code: "BOL",
    countryName: "Bolivia",
    nationalityName: "Bolivian",
    continentID: 7,
  },
  {
    code: "BIH",
    countryName: "Bosnia and Herzegovina",
    nationalityName: "Bosnian",
    continentID: 4,
  },
  {
    code: "BWA",
    countryName: "Botswana",
    nationalityName: "Botswana",
    continentID: 1,
  },
  {
    code: "BRA",
    countryName: "Brazil",
    nationalityName: "Brazilian",
    continentID: 7,
  },
  {
    code: "BRN",
    countryName: "Brunei",
    nationalityName: "Bruneian",
    continentID: 3,
  },
  {
    code: "BGR",
    countryName: "Bulgaria",
    nationalityName: "Bulgarian",
    continentID: 4,
  },
  {
    code: "BFA",
    countryName: "Burkina Faso",
    nationalityName: "Burkinese",
    continentID: 1,
  },
  {
    code: "BDI",
    countryName: "Burundi",
    nationalityName: "Burundian",
    continentID: 1,
  },
  {
    code: "CPV",
    countryName: "Cabo Verde",
    nationalityName: "Cape Verdean",
    continentID: 1,
  },
  {
    code: "KHM",
    countryName: "Cambodia",
    nationalityName: "Cambodian",
    continentID: 3,
  },
  {
    code: "CMR",
    countryName: "Cameroon",
    nationalityName: "Cameroonian",
    continentID: 1,
  },
  {
    code: "CAN",
    countryName: "Canada",
    nationalityName: "Canadian",
    continentID: 5,
  },
  {
    code: "CAF",
    countryName: "Central African Republic",
    nationalityName: "Central African",
    continentID: 1,
  },
  {
    code: "TCD",
    countryName: "Chad",
    nationalityName: "Chadian",
    continentID: 1,
  },
  {
    code: "CHL",
    countryName: "Chile",
    nationalityName: "Chilean",
    continentID: 7,
  },
  {
    code: "CHN",
    countryName: "China",
    nationalityName: "Chinese",
    continentID: 3,
  },
  {
    code: "COL",
    countryName: "Colombia",
    nationalityName: "Colombian",
    continentID: 7,
  },
  {
    code: "COM",
    countryName: "Comoros",
    nationalityName: "Comoran",
    continentID: 1,
  },
  {
    code: "COG",
    countryName: "Congo",
    nationalityName: "Congolese",
    continentID: 1,
  },
  {
    code: "COD",
    countryName: "Democratic Republic of the Congo",
    nationalityName: "Congolese",
    continentID: 1,
  },
  {
    code: "COK",
    countryName: "Cook Islands",
    nationalityName: "Cook Islander",
    continentID: 6,
  },
  {
    code: "CRI",
    countryName: "Costa Rica",
    nationalityName: "Costa Rican",
    continentID: 5,
  },
  {
    code: "CIV",
    countryName: "Ivory Coast",
    nationalityName: "Ivorian",
    continentID: 1,
  },
  {
    code: "HRV",
    countryName: "Croatia",
    nationalityName: "Croatian",
    continentID: 4,
  },
  {
    code: "CUB",
    countryName: "Cuba",
    nationalityName: "Cuban",
    continentID: 5,
  },
  {
    code: "CYP",
    countryName: "Cyprus",
    nationalityName: "Cypriot",
    continentID: 4,
  },
  {
    code: "CZE",
    countryName: "Czech Republic",
    nationalityName: "Czech",
    continentID: 4,
  },
  {
    code: "DNK",
    countryName: "Denmark",
    nationalityName: "Danish",
    continentID: 4,
  },
  {
    code: "DJI",
    countryName: "Djibouti",
    nationalityName: "Djiboutian",
    continentID: 1,
  },
  {
    code: "DMA",
    countryName: "Dominica",
    nationalityName: "Dominican",
    continentID: 5,
  },
  {
    code: "DOM",
    countryName: "Dominican Republic",
    nationalityName: "Dominican",
    continentID: 5,
  },
  {
    code: "ECU",
    countryName: "Ecuador",
    nationalityName: "Ecuadorian",
    continentID: 7,
  },
  {
    code: "EGY",
    countryName: "Egypt",
    nationalityName: "Egyptian",
    continentID: 1,
  },
  {
    code: "SLV",
    countryName: "El Salvador",
    nationalityName: "Salvadoran",
    continentID: 5,
  },
  {
    code: "GNQ",
    countryName: "Equatorial Guinea",
    nationalityName: "Equatoguinean",
    continentID: 1,
  },
  {
    code: "ERI",
    countryName: "Eritrea",
    nationalityName: "Eritrean",
    continentID: 1,
  },
  {
    code: "EST",
    countryName: "Estonia",
    nationalityName: "Estonian",
    continentID: 4,
  },
  {
    code: "SWZ",
    countryName: "Eswatini",
    nationalityName: "Eswatini",
    continentID: 1,
  },
  {
    code: "ETH",
    countryName: "Ethiopia",
    nationalityName: "Ethiopian",
    continentID: 1,
  },
  {
    code: "FJI",
    countryName: "Fiji",
    nationalityName: "Fijian",
    continentID: 6,
  },
  {
    code: "FIN",
    countryName: "Finland",
    nationalityName: "Finnish",
    continentID: 4,
  },
  {
    code: "FRA",
    countryName: "France",
    nationalityName: "French",
    continentID: 4,
  },
  {
    code: "GAB",
    countryName: "Gabon",
    nationalityName: "Gabonese",
    continentID: 1,
  },
  {
    code: "GMB",
    countryName: "Gambia",
    nationalityName: "Gambian",
    continentID: 1,
  },
  {
    code: "GEO",
    countryName: "Georgia",
    nationalityName: "Georgian",
    continentID: 3,
  },
  {
    code: "DEU",
    countryName: "Germany",
    nationalityName: "German",
    continentID: 4,
  },
  {
    code: "GHA",
    countryName: "Ghana",
    nationalityName: "Ghanaian",
    continentID: 1,
  },
  {
    code: "GRC",
    countryName: "Greece",
    nationalityName: "Greek",
    continentID: 4,
  },
  {
    code: "GRD",
    countryName: "Grenada",
    nationalityName: "Grenadian",
    continentID: 5,
  },
  {
    code: "GTM",
    countryName: "Guatemala",
    nationalityName: "Guatemalan",
    continentID: 5,
  },
  {
    code: "GIN",
    countryName: "Guinea",
    nationalityName: "Guinean",
    continentID: 1,
  },
  {
    code: "GNB",
    countryName: "Guinea-Bissau",
    nationalityName: "Guinean",
    continentID: 1,
  },
  {
    code: "GUY",
    countryName: "Guyana",
    nationalityName: "Guyanese",
    continentID: 7,
  },
  {
    code: "HTI",
    countryName: "Haiti",
    nationalityName: "Haitian",
    continentID: 5,
  },
  {
    code: "HND",
    countryName: "Honduras",
    nationalityName: "Honduran",
    continentID: 5,
  },
  {
    code: "HUN",
    countryName: "Hungary",
    nationalityName: "Hungarian",
    continentID: 4,
  },
  {
    code: "ISL",
    countryName: "Iceland",
    nationalityName: "Icelander",
    continentID: 4,
  },
  {
    code: "IND",
    countryName: "India",
    nationalityName: "Indian",
    continentID: 3,
  },
  {
    code: "IDN",
    countryName: "Indonesia",
    nationalityName: "Indonesian",
    continentID: 3,
  },
  {
    code: "IRN",
    countryName: "Iran",
    nationalityName: "Iranian",
    continentID: 3,
  },
  {
    code: "IRQ",
    countryName: "Iraq",
    nationalityName: "Iraqi",
    continentID: 3,
  },
  {
    code: "IRL",
    countryName: "Ireland",
    nationalityName: "Irish",
    continentID: 4,
  },
  {
    code: "ISR",
    countryName: "Israel",
    nationalityName: "Israeli",
    continentID: 3,
  },
  {
    code: "ITA",
    countryName: "Italy",
    nationalityName: "Italian",
    continentID: 4,
  },
  {
    code: "JAM",
    countryName: "Jamaica",
    nationalityName: "Jamaican",
    continentID: 5,
  },
  {
    code: "JPN",
    countryName: "Japan",
    nationalityName: "Japanese",
    continentID: 3,
  },
  {
    code: "JOR",
    countryName: "Jordan",
    nationalityName: "Jordanian",
    continentID: 3,
  },
  {
    code: "KAZ",
    countryName: "Kazakhstan",
    nationalityName: "Kazakh",
    continentID: 3,
  },
  {
    code: "KEN",
    countryName: "Kenya",
    nationalityName: "Kenyan",
    continentID: 1,
  },
  {
    code: "KIR",
    countryName: "Kiribati",
    nationalityName: "I-Kiribati",
    continentID: 6,
  },
  {
    code: "KOR",
    countryName: "South Korea",
    nationalityName: "Korean",
    continentID: 3,
  },
  {
    code: "KWT",
    countryName: "Kuwait",
    nationalityName: "Kuwaiti",
    continentID: 3,
  },
  {
    code: "KGZ",
    countryName: "Kyrgyzstan",
    nationalityName: "Kyrgyzstani",
    continentID: 3,
  },
  {
    code: "LAO",
    countryName: "Laos",
    nationalityName: "Laotian",
    continentID: 3,
  },
  {
    code: "LVA",
    countryName: "Latvia",
    nationalityName: "Latvian",
    continentID: 4,
  },
  {
    code: "LBN",
    countryName: "Lebanon",
    nationalityName: "Lebanese",
    continentID: 3,
  },
  {
    code: "LSO",
    countryName: "Lesotho",
    nationalityName: "Lesotho",
    continentID: 1,
  },
  {
    code: "LBR",
    countryName: "Liberia",
    nationalityName: "Liberian",
    continentID: 1,
  },
  {
    code: "LBY",
    countryName: "Libya",
    nationalityName: "Libyan",
    continentID: 1,
  },
  {
    code: "LIE",
    countryName: "Liechtenstein",
    nationalityName: "Liechtenstein",
    continentID: 4,
  },
  {
    code: "LTU",
    countryName: "Lithuania",
    nationalityName: "Lithuanian",
    continentID: 4,
  },
  {
    code: "LUX",
    countryName: "Luxembourg",
    nationalityName: "Luxembourgian",
    continentID: 4,
  },
  {
    code: "MDG",
    countryName: "Madagascar",
    nationalityName: "Malagasy",
    continentID: 1,
  },
  {
    code: "MWI",
    countryName: "Malawi",
    nationalityName: "Malawian",
    continentID: 1,
  },
  {
    code: "MYS",
    countryName: "Malaysia",
    nationalityName: "Malaysian",
    continentID: 3,
  },
  {
    code: "MDV",
    countryName: "Maldives",
    nationalityName: "Maldivian",
    continentID: 3,
  },
  {
    code: "MLI",
    countryName: "Mali",
    nationalityName: "Malian",
    continentID: 1,
  },
  {
    code: "MLT",
    countryName: "Malta",
    nationalityName: "Maltese",
    continentID: 4,
  },
  {
    code: "MHL",
    countryName: "Marshall Islands",
    nationalityName: "Marshallese",
    continentID: 6,
  },
  {
    code: "MRT",
    countryName: "Mauritania",
    nationalityName: "Mauritanian",
    continentID: 1,
  },
  {
    code: "MUS",
    countryName: "Mauritius",
    nationalityName: "Mauritian",
    continentID: 1,
  },
  {
    code: "MYT",
    countryName: "Mayotte",
    nationalityName: "Mahoran",
    continentID: 1,
  },
  {
    code: "MEX",
    countryName: "Mexico",
    nationalityName: "Mexican",
    continentID: 5,
  },
  {
    code: "FSM",
    countryName: "Micronesia",
    nationalityName: "Micronesian",
    continentID: 6,
  },
  {
    code: "MDA",
    countryName: "Moldova",
    nationalityName: "Moldovan",
    continentID: 4,
  },
  {
    code: "MCO",
    countryName: "Monaco",
    nationalityName: "Monacan",
    continentID: 4,
  },
  {
    code: "MNG",
    countryName: "Mongolia",
    nationalityName: "Mongolian",
    continentID: 3,
  },
  {
    code: "MNE",
    countryName: "Montenegro",
    nationalityName: "Montenegrin",
    continentID: 4,
  },
  {
    code: "MOZ",
    countryName: "Mozambique",
    nationalityName: "Mozambican",
    continentID: 1,
  },
  {
    code: "MMR",
    countryName: "Myanmar",
    nationalityName: "Burmese",
    continentID: 3,
  },
  {
    code: "NAM",
    countryName: "Namibia",
    nationalityName: "Namibian",
    continentID: 1,
  },
  {
    code: "NRU",
    countryName: "Nauru",
    nationalityName: "Nauruan",
    continentID: 6,
  },
  {
    code: "NPL",
    countryName: "Nepal",
    nationalityName: "Nepalese",
    continentID: 3,
  },
  {
    code: "NLD",
    countryName: "Netherlands",
    nationalityName: "Dutch",
    continentID: 4,
  },
  {
    code: "NZL",
    countryName: "New Zealand",
    nationalityName: "New Zealander",
    continentID: 6,
  },
  {
    code: "NIC",
    countryName: "Nicaragua",
    nationalityName: "Nicaraguan",
    continentID: 5,
  },
  {
    code: "NER",
    countryName: "Niger",
    nationalityName: "Nigerien",
    continentID: 1,
  },
  {
    code: "NGA",
    countryName: "Nigeria",
    nationalityName: "Nigerian",
    continentID: 1,
  },
  {
    code: "PRK",
    countryName: "North Korea",
    nationalityName: "North Korean",
    continentID: 3,
  },
  {
    code: "MNP",
    countryName: "Northern Mariana Islands",
    nationalityName: "Northern Mariana Islander",
    continentID: 6,
  },
  {
    code: "NOR",
    countryName: "Norway",
    nationalityName: "Norwegian",
    continentID: 4,
  },
  {
    code: "OMN",
    countryName: "Oman",
    nationalityName: "Omani",
    continentID: 3,
  },
  {
    code: "PAK",
    countryName: "Pakistan",
    nationalityName: "Pakistani",
    continentID: 3,
  },
  {
    code: "PLW",
    countryName: "Palau",
    nationalityName: "Palauan",
    continentID: 6,
  },
  {
    code: "PAN",
    countryName: "Panama",
    nationalityName: "Panamanian",
    continentID: 5,
  },
  {
    code: "PNG",
    countryName: "Papua New Guinea",
    nationalityName: "Papua New Guinean",
    continentID: 6,
  },
  {
    code: "PRT",
    countryName: "Portugal",
    nationalityName: "Portuguese",
    continentID: 4,
  },
  {
    code: "PRI",
    countryName: "Puerto Rico",
    nationalityName: "Puerto Rican",
    continentID: 5,
  },
  {
    code: "QAT",
    countryName: "Qatar",
    nationalityName: "Qatari",
    continentID: 3,
  },
  {
    code: "ROU",
    countryName: "Romania",
    nationalityName: "Romanian",
    continentID: 4,
  },
  {
    code: "RUS",
    countryName: "Russia",
    nationalityName: "Russian",
    continentID: 3,
  },
  {
    code: "RWA",
    countryName: "Rwanda",
    nationalityName: "Rwandan",
    continentID: 1,
  },
  {
    code: "KNA",
    countryName: "Saint Kitts and Nevis",
    nationalityName: "Kittitian or Nevisian",
    continentID: 5,
  },
  {
    code: "LCA",
    countryName: "Saint Lucia",
    nationalityName: "Saint Lucian",
    continentID: 5,
  },
  {
    code: "VCT",
    countryName: "Saint Vincent and the Grenadines",
    nationalityName: "Saint Vincentian",
    continentID: 5,
  },
  {
    code: "WSM",
    countryName: "Samoa",
    nationalityName: "Samoan",
    continentID: 6,
  },
  {
    code: "SMR",
    countryName: "San Marino",
    nationalityName: "Sammarinese",
    continentID: 4,
  },
  {
    code: "STP",
    countryName: "São Tomé and Príncipe",
    nationalityName: "São Toméan",
    continentID: 1,
  },
  {
    code: "SAU",
    countryName: "Saudi Arabia",
    nationalityName: "Saudi",
    continentID: 3,
  },
  {
    code: "SEN",
    countryName: "Senegal",
    nationalityName: "Senegalese",
    continentID: 1,
  },
  {
    code: "SRB",
    countryName: "Serbia",
    nationalityName: "Serbian",
    continentID: 4,
  },
  {
    code: "SYC",
    countryName: "Seychelles",
    nationalityName: "Seychellois",
    continentID: 1,
  },
  {
    code: "SLE",
    countryName: "Sierra Leone",
    nationalityName: "Sierra Leonean",
    continentID: 1,
  },
  {
    code: "SGP",
    countryName: "Singapore",
    nationalityName: "Singaporean",
    continentID: 3,
  },
  {
    code: "SVK",
    countryName: "Slovakia",
    nationalityName: "Slovak",
    continentID: 4,
  },
  {
    code: "SVN",
    countryName: "Slovenia",
    nationalityName: "Slovene",
    continentID: 4,
  },
  {
    code: "SLB",
    countryName: "Solomon Islands",
    nationalityName: "Solomon Islander",
    continentID: 6,
  },
  {
    code: "SOM",
    countryName: "Somalia",
    nationalityName: "Somali",
    continentID: 1,
  },
  {
    code: "ZAF",
    countryName: "South Africa",
    nationalityName: "South African",
    continentID: 1,
  },
  {
    code: "SSD",
    countryName: "South Sudan",
    nationalityName: "South Sudanese",
    continentID: 1,
  },
  {
    code: "ESP",
    countryName: "Spain",
    nationalityName: "Spanish",
    continentID: 4,
  },
  {
    code: "LKA",
    countryName: "Sri Lanka",
    nationalityName: "Sri Lankan",
    continentID: 3,
  },
  {
    code: "SDN",
    countryName: "Sudan",
    nationalityName: "Sudanese",
    continentID: 1,
  },
  {
    code: "SUR",
    countryName: "Suriname",
    nationalityName: "Surinamese",
    continentID: 7,
  },
  {
    code: "SWE",
    countryName: "Sweden",
    nationalityName: "Swedish",
    continentID: 4,
  },
  {
    code: "CHE",
    countryName: "Switzerland",
    nationalityName: "Swiss",
    continentID: 4,
  },
  {
    code: "SYR",
    countryName: "Syria",
    nationalityName: "Syrian",
    continentID: 3,
  },
  {
    code: "TJK",
    countryName: "Tajikistan",
    nationalityName: "Tajik",
    continentID: 3,
  },
  {
    code: "TAN",
    countryName: "Tanzania",
    nationalityName: "Tanzanian",
    continentID: 1,
  },
  {
    code: "THA",
    countryName: "Thailand",
    nationalityName: "Thai",
    continentID: 3,
  },
  {
    code: "TLS",
    countryName: "Timor-Leste",
    nationalityName: "Timorese",
    continentID: 3,
  },
  {
    code: "TGO",
    countryName: "Togo",
    nationalityName: "Togolese",
    continentID: 1,
  },
  {
    code: "TKM",
    countryName: "Turkmenistan",
    nationalityName: "Turkmen",
    continentID: 3,
  },
  {
    code: "TON",
    countryName: "Tonga",
    nationalityName: "Tongan",
    continentID: 6,
  },
  {
    code: "TTO",
    countryName: "Trinidad and Tobago",
    nationalityName: "Trinidadian or Tobagonian",
    continentID: 5,
  },
  {
    code: "TUN",
    countryName: "Tunisia",
    nationalityName: "Tunisian",
    continentID: 1,
  },
  {
    code: "TUR",
    countryName: "Turkey",
    nationalityName: "Turkish",
    continentID: 3,
  },
  {
    code: "TKL",
    countryName: "Tokelau",
    nationalityName: "Tokelauan",
    continentID: 6,
  },
  {
    code: "TUV",
    countryName: "Tuvalu",
    nationalityName: "Tuvaluan",
    continentID: 6,
  },
  {
    code: "UGA",
    countryName: "Uganda",
    nationalityName: "Ugandan",
    continentID: 1,
  },
  {
    code: "UKR",
    countryName: "Ukraine",
    nationalityName: "Ukrainian",
    continentID: 4,
  },
  {
    code: "ARE",
    countryName: "United Arab Emirates",
    nationalityName: "Emirati",
    continentID: 3,
  },
  {
    code: "GBR",
    countryName: "United Kingdom",
    nationalityName: "British",
    continentID: 4,
  },
  {
    code: "USA",
    countryName: "United States",
    nationalityName: "American",
    continentID: 5,
  },
  {
    code: "URY",
    countryName: "Uruguay",
    nationalityName: "Uruguayan",
    continentID: 7,
  },
  {
    code: "UZB",
    countryName: "Uzbekistan",
    nationalityName: "Uzbek",
    continentID: 3,
  },
  {
    code: "VUT",
    countryName: "Vanuatu",
    nationalityName: "Vanuatuan",
    continentID: 6,
  },
  {
    code: "VEN",
    countryName: "Venezuela",
    nationalityName: "Venezuelan",
    continentID: 7,
  },
  {
    code: "VNM",
    countryName: "Vietnam",
    nationalityName: "Vietnamese",
    continentID: 3,
  },
  {
    code: "VGB",
    countryName: "Virgin Islands",
    nationalityName: "Virgin Islander",
    continentID: 5,
  },
  {
    code: "WLF",
    countryName: "Wallis and Futuna",
    nationalityName: "Wallisian",
    continentID: 6,
  },
  {
    code: "WSM",
    countryName: "Samoa",
    nationalityName: "Samoan",
    continentID: 6,
  },
  {
    code: "YEM",
    countryName: "Yemen",
    nationalityName: "Yemeni",
    continentID: 3,
  },
  {
    code: "ZMB",
    countryName: "Zambia",
    nationalityName: "Zambian",
    continentID: 1,
  },
  {
    code: "ZWE",
    countryName: "Zimbabwe",
    nationalityName: "Zimbabwean",
    continentID: 1,
  },
];

// utils/dataFetchers.ts

export async function fetchAllBannedData() {
  const [
    bannedCountries,
    bannedContinents,
    bannedNationality,
    countries,
    nationalities,
    accountTypes,
    continents,
    accountStationOptions,
  ] = await Promise.all([
    viewAllBannedCountries(),
    viewAllBannedContinents(),
    viewAllBannedNationalities(),
    getAllCountries(),
    getAllNationalities(),
    getAllAccountTypes(),
    getAllContinents(),
    getAllAccountStationOptions(),
  ]);

  return {
    bannedCountries,
    bannedContinents,
    bannedNationality,
    countries,
    nationalities,
    accountTypes,
    continents,
    accountStationOptions,
  };
}
