"use client";
import { Login } from "@/components/stytch/login";
import { Typography } from "@/components/typography";
import { useStytchSession } from "@stytch/nextjs";

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

        {!session ? (
          <div className="max-w-lg">
            <Login />
          </div>
        ) : null}
        {/* TODO add create room button */}
      </div>
    </main>
  );
}
