"use server";

import { createServer } from "@/utils/supabase/server";

export const getRoom = async (id: string) => {
  const supabase = createServer();
  try {
    const room = await supabase.from("Room").select().eq("id", id);
    if (room.error) {
      throw new Error("Room not found.");
    }

    return room;
  } catch (e) {
    console.error(e);
  }
};
