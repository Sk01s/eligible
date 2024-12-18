import { z } from "zod";

export const formSchemaEligible = z.object({
  country: z.string().min(1, "Country is required"), // Ensures non-empty string
  nationality: z.string().min(1, "Nationality is required"), // Ensures non-empty string
  accountType: z.string().min(1, "Account Type is required"), // Ensures non-empty string
});

export type FormSchema = z.infer<typeof formSchemaEligible>; // TypeScript type for validated data
