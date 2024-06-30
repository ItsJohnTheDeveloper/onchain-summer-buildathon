"use server";

import { createServer } from "@/utils/supabase/server";

type UpdateRoomData = {
  id: string;
  question?: string;
  winner?: string;
  users?: string[];
  transactionId?: string;
};

export const updateRoom = async (data: UpdateRoomData) => {
  // todo - check user is authenticated
  const supabase = createServer();
  const room = await supabase
    .from("room")
    .update(data)
    .eq("id", data.id)
    .single();

  if (room.error) {
    console.error(room.error);
    throw new Error("There was an error updating the room.");
  }
  return room.data;
};