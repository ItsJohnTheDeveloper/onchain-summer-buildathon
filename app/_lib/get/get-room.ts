"use server";

import { createServer } from "@/utils/supabase/server";

export const getRoom = async (id: number) => {
  const supabase = createServer();
  const room = await supabase.from("room").select("*").eq("id", id).single();
  if (room.error) {
    console.error(room.error);
    throw new Error("Room not found.");
  }

  const data: Room = room.data;
  return data;
};
