"use server";

import { createServer } from "@/utils/supabase/server";

export type PostRoomData = {
  question: string;
  creator: string;
};

export const postRoom = async (data: PostRoomData) => {
  // todo - check user is authenticated
  const supabase = createServer();
  const room = await supabase.from("room").insert(data).select().single();
  if (room.error) {
    console.log({ error: room.error });
    throw new Error("There was an error creating room.");
  }
  return room.data;
};
