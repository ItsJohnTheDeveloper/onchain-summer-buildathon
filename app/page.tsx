import { Button } from "@/components/button";
import { Typography } from "@/components/typography";

export const preferredRegion = "home";
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="container">
      <div className="flex items-center mt-16 flex-col gap-4">
        <Typography variant="h1">Welcome to Wallet Rescue</Typography>
        <Typography className="text-secondary-foreground" variant="h4">
          Connect your wallet to get started
        </Typography>
        <Button>
          <a className="font-semibold" href="/wallet">
            Connect Wallet
          </a>
        </Button>
      </div>
    </main>
  );
}
