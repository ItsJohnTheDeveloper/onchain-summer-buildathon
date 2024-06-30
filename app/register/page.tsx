"use client";

import { Button } from "@/components/button";
import { Lock } from "@/components/icons";
import { Typography } from "@/components/typography";
import { useRouter, useSearchParams } from "next/navigation";
import { SmartWalletSDK } from "@crossmint/client-sdk-aa-passkeys-beta";
import { useStytchSession } from "@stytch/nextjs";
import Error from "next/error";

// const CrossmintSDK = SmartWalletSDK.init({
//   clientApiKey:
//     "ck_staging_6CDH3rLS3CrViDpE4YwN1w8AZddxJYzeTsBzEVXQjsP8Uh9rKAr5iStYAnAiK82tJNK1g3wKJkhFaSmS4asERMBtgGg28AKreuhPk4Wu2JNf6eM5Xj9CE1mS6a9ckTMddjZNnCxgvMMxZmn7Qmc2Ab39mY7cn68U5ra8tTHgcGX1K1Mdw45bdTPK3EwAoeos3hupMxRxiok9onLGYGc3F2ST",
// });

export default function Register() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { session } = useStytchSession();
  const userId = session?.user_id;
  const redirectURL = searchParams?.get("redirect") ?? "";

  if (!userId) {
    return <Error statusCode={403} />;
  }

  return (
    <div className="container max-w-lg flex flex-col">
      <Lock />
      <Typography>register passkey here</Typography>
      <Button
        onClick={() => {
          // CrossmintSDK.getOrCreateWallet();
          if (redirectURL) {
            router.push(redirectURL);
          }
        }}
      >
        Register
      </Button>
    </div>
  );
}
