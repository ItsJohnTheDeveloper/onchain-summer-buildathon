"use client";

import { Button } from "@/components/button";
import { Lock, Spinner } from "@/components/icons";
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
import { useState } from "react";

export default function Register() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { session } = useStytchSession();
  const userId = session?.user_id ?? "";
  const redirectURL = searchParams?.get("redirect") ?? "/";

  const sessionEmail =
    // @ts-expect-error - session type is wrong
    session?.authentication_factors?.[0]?.email_factor?.email_address ?? "";

  console.log({ redirectURL, userId, sessionEmail });

  const mutationPostUser = useMutation({
    mutationKey: ["user"],
    mutationFn: postUser,
  });
  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => await getUser(userId),
  });
  const [isLoadingRegistration, setIsLoadingRegistration] = useState(false);

  if (isLoading) {
    return (
      <div className="container flex flex-col p-8">
        <Skeleton className="h-10 w-full max-w-6xl" />
      </div>
    );
  }

  if (!userId) {
    return (
      <NextError statusCode={401} title="You are not authorized to be here" />
    );
  }

  if (userData) {
    // if a user exists, they are already registered so redirect them to the room/create page
    console.log({ redirectURL });
    router.push(redirectURL);
  }

  const handleOnRegister = async () => {
    setIsLoadingRegistration(true);
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
      console.log("done creating wallet... ", wallet.address);
      await mutationPostUser.mutateAsync({
        userId,
        walletAddress: wallet.address,
        email: sessionEmail,
      } as PostUserData);

      console.log({ redirectURL });
      if (redirectURL) {
        router.push(redirectURL);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingRegistration(false);
    }
  };

  return (
    <div className="container max-w-lg flex flex-col items-center py-4">
      <Lock className="w-24 h-24" />
      <Typography className="py-6">
        To proceed to room, please register your Passkey.
      </Typography>
      <Button
        type="button"
        className="max-w-xs min-w-32"
        disabled={isLoadingRegistration}
        onClick={handleOnRegister}
      >
        {isLoadingRegistration ? <Spinner /> : "Register"}
      </Button>
    </div>
  );
}
