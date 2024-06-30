"use server";

import { createServer } from "@/utils/supabase/server";

type PostRoomData = {
  question: string;
  creator: string;
};

export const postRoom = async (data: PostRoomData) => {
  // todo - check user is authenticated
  const supabase = createServer();
  try {
    const room = await supabase.from("Room").insert([data]);

    if (room.error) {
      throw new Error("There was an error creating the room.");
    }
    return room;
  } catch (e) {
    console.error(e);
  }
};
