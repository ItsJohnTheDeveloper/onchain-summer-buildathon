"use server";

import { createServer } from "@/utils/supabase/server";

type PostAnswerData = {
  userId: string;
  answer: string;
  roomId: string;
};

export const postAnswer = async (data: PostAnswerData) => {
  // todo - check user is authenticated
  const supabase = createServer();
  try {
    const answer = await supabase.from("Answer").insert([data]);

    if (answer.error) {
      throw new Error("There was an error creating answer.");
    }
    return answer;
  } catch (e) {
    console.error(e);
  }
};
