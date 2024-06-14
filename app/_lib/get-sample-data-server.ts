"use server";

import { createServer } from "@/utils/supabase/server";

export const getSampleDataServer = async () => {
  const supabase = createServer();
  const { data: notes } = await supabase.from("notes").select();
  console.log("getting data from server");
  return notes;
};
