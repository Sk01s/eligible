"use server";

export async function IsLogedIn(code: string) {
  return code === process.env.ID;
}
