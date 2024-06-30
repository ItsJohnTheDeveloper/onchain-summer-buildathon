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
  try {
    const room = await supabase.from("Room").update(data).eq("id", data.id);

    if (room.error) {
      throw new Error("There was an error updating the room.");
    }
    return room;
  } catch (e) {
    console.error(e);
  }
};
