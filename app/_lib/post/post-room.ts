"use server";

import { createServer } from "@/utils/supabase/server";

export type PostRoomData = {
  question: string;
  creator: string;
  participants: string[];
};

export const postRoom = async (data: PostRoomData) => {
  // todo - check user is authenticated
  const supabase = createServer();
  const room = await supabase.from("room").insert(data).select().single();
  if (room.error) {
    throw new Error(
      "There was an error creating a room. " + room.error.message
    );
  }
  return room.data;
};
