import { Inter, Raleway } from "next/font/google";
import "./globals.css";

import { Providers } from "./_lib/providers";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";

export const metadata = {
  metadataBase: new URL("https://recovery.vercel.app"),
  title: "Onchain Buildathon - The Room",
  // description:
  //   "Social Recovery allows wallet holders to recover their funds by asking friends to help them via Passkeys.",
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-raleway",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const walletData = {
    publicKey: "0x1234...",
    publicPhoto: "/Avatar.webp",
  };
  return (
    <Providers>
      <html
        // Add the font variables so they be available for tailwind
        className={cn(inter.variable, raleway.variable)}
        data-theme="dark"
      >
        <head>
          <title>{metadata.title as string}</title>
        </head>
        <body className="font-body bg-background text-foreground min-h-screen antialiased">
          <div className="flex min-h-screen flex-col">
            <Header wallet={walletData} />
            {children}
          </div>
        </body>
      </html>
    </Providers>
  );
}
