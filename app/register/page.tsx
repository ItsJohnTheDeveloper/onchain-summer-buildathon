"use client";

import { Button } from "@/components/button";
import { Lock } from "@/components/icons";
import { Typography } from "@/components/typography";
import { useRouter, useSearchParams } from "next/navigation";
import { SmartWalletSDK } from "@crossmint/client-sdk-aa-passkeys-beta";
import { useStytchSession } from "@stytch/nextjs";
import Cookies from "js-cookie";
import { useMutation, useQuery } from "@tanstack/react-query";
import { PostUserData, postUser } from "../_lib/post/post-user";
import NextError from "next/error";
import { getUser } from "../_lib/get/get-user";
import { Skeleton } from "@/components/skeleton";

export default function Register() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { session } = useStytchSession();
  const userId = session?.user_id ?? "";
  const redirectURL = searchParams?.get("redirect") ?? "/";

  const mutationPostUser = useMutation({
    mutationFn: postUser,
  });
  const { data, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => await getUser(userId),
  });

  console.log({ user: data });

  if (isLoading) {
    return <Skeleton className="self-center h-96 w-full md:max-w-lg" />;
  }

  if (!userId) {
    return (
      <NextError statusCode={401} title="You are not authorized to be here" />
    );
  }

  if (data) {
    // if a user exists, they are already registered so redirect them to the room/create page
    console.log({ redirectURL });
    router.push(redirectURL);
  }

  const handleOnRegister = async () => {
    const CrossmintSDK = SmartWalletSDK.init({
      clientApiKey:
        "ck_staging_6CDH3rLS3CrViDpE4YwN1w8AZddxJYzeTsBzEVXQjsP8Uh9rKAr5iStYAnAiK82tJNK1g3wKJkhFaSmS4asERMBtgGg28AKreuhPk4Wu2JNf6eM5Xj9CE1mS6a9ckTMddjZNnCxgvMMxZmn7Qmc2Ab39mY7cn68U5ra8tTHgcGX1K1Mdw45bdTPK3EwAoeos3hupMxRxiok9onLGYGc3F2ST",
    });
    const sessionJWT = Cookies.get("stytch_session_jwt");

    try {
      if (!userId || !sessionJWT) {
        throw new Error("User not authed");
      }
      const wallet = await CrossmintSDK.getOrCreateWallet(
        { id: userId, jwt: sessionJWT },
        "polygon-amoy"
      );

      await mutationPostUser.mutateAsync({
        userId,
        walletAddress: wallet.address,
      } as PostUserData);

      console.log({ redirectURL });
      if (redirectURL) {
        router.push(redirectURL);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container max-w-lg flex flex-col items-center py-4">
      <Lock className="w-24 h-24" />
      <Typography className="py-6">
        To proceed to room, please register your Passkey.
      </Typography>
      <Button className="max-w-xs" onClick={handleOnRegister}>
        Register
      </Button>
    </div>
  );
}