import { createClient } from "@/utils/supabase/client";

export const getSampleDataClient = async () => {
  const supabase = createClient();
  const { data: notes } = await supabase.from("notes").select();
  console.log("getting data from client");
  return notes;
};
