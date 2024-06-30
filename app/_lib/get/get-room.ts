"use server";

import { createServer } from "@/utils/supabase/server";

export const getRoom = async (id: string) => {
  const supabase = createServer();
  const room = await supabase.from("room").select().eq("id", id).single();
  if (room.error) {
    console.error(room.error);
    throw new Error("Room not found.");
  }

  return room.data;
};
