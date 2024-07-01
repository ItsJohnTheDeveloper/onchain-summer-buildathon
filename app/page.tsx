"use client";
import { Button } from "@/components/button";
import { Login } from "@/components/stytch/login";
import { Typography } from "@/components/typography";
import { useStytchSession } from "@stytch/nextjs";
import Link from "next/link";

export const preferredRegion = "home";
export const dynamic = "force-dynamic";

export default function Home() {
  const { session } = useStytchSession();
  return (
    <main className="container">
      <div className="flex items-center mt-16 flex-col gap-4">
        <Typography variant="h1">Onchain Summer Buildathon project</Typography>
        <div className="h-3" />
        {/* <HomepageStepper /> */}

        {session ? (
          <Link href="/room/create">
            <Button type="button">Create a Room</Button>
          </Link>
        ) : (
          <div className="max-w-lg">
            <Login />
          </div>
        )}
      </div>
    </main>
  );
}
