"use client";
import { Button } from "@/components/button";
import { HomepageStepper } from "@/components/homepage-stepper";
import { Input } from "@/components/input";
import { Login } from "@/components/stytch/login";
import { Typography } from "@/components/typography";
import { useStytchSession } from "@stytch/nextjs";
import { useState } from "react";

export const preferredRegion = "home";
export const dynamic = "force-dynamic";

export default function Home() {
  const { session } = useStytchSession();

  const base = "http://localhost:3000";
  const authUrl = new URL(`${base}/authenticate`);
  const registerURL = new URL(`${base}/register`);
  const destinationUrl = new URL(`${base}/`);
  registerURL.searchParams.set("redirect", destinationUrl.toString());
  authUrl.searchParams.set("redirect", registerURL.toString());

  const magicLinkUrl = authUrl.toString();
  // console.log({ magicLinkUrl });
  return (
    <main className="container">
      <div className="flex items-center mt-16 flex-col gap-4">
        <Typography variant="h1">Onchain Summer Buildathon project</Typography>
        <div className="h-3" />
        {/* <HomepageStepper /> */}

        {!session ? (
          <div className="max-w-lg">
            <Login />
          </div>
        ) : null}
      </div>
    </main>
  );
}
