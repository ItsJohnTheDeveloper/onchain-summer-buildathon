"use server";

import { createServer } from "@/utils/supabase/server";

export type PostUserData = {
  userId: string;
  walletAddress: string;
  email: string;
};

export const postUser = async (data: PostUserData) => {
  // todo - check user is authenticated
  const { userId, walletAddress, email } = data;
  if (!userId || !walletAddress || !email) {
    throw new Error("No UserID or Wallet Address found.");
  }
  const supabase = createServer();
  const user = await supabase
    .from("user")
    .insert({ walletAddress, userId, email })
    .select()
    .single();

  if (user.error) {
    console.error(user.error);
    throw new Error("There was an error creating a user, please try again.");
  }

  return user.data;
};
