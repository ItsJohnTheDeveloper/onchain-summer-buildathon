"use server";

import { createServer } from "@/utils/supabase/server";

export const postWalletAddress = async (
  userId: string,
  walletAddress: string
) => {
  // todo - check user is authenticated
  if (!userId) {
    throw new Error("No UserID found.");
  }
  const supabase = createServer();
  try {
    const user = await supabase
      .from("User")
      .update({ walletAddress })
      .eq("userId", userId);

    if (user.error) {
      throw new Error("User not found.");
    }

    return user;
  } catch (e) {
    console.error(e);
  }
};
