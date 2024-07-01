"use server";

import { createServer } from "@/utils/supabase/server";

export type UpdateRoomData = {
  roomId: number;
  question?: string;
  winner?: string;
  users?: string[];
  transactionId?: string;
  participants?: string[];
  status?: Room["status"];
};

export const updateRoom = async (data: UpdateRoomData) => {
  // todo - check user is authenticated
  const supabase = createServer();
  const room = await supabase
    .from("room")
    .update({ ...data, roomId: undefined })
    .eq("id", data.roomId)
    .select()
    .single();

  if (room.error) {
    console.error(room.error);
    throw new Error("There was an error updating the room.");
  }
  return room.data;
};
