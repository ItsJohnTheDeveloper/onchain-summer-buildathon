"use client";

import { useEffect, useState } from "react";
import { Switch } from "./switch";
import { Typography } from "./typography";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { useQuery } from "@tanstack/react-query";
import { getSampleDataServer } from "@/app/_lib/get-sample-data-server";
import Link from "next/link";
import { Profile } from "./icons";
import { Skeleton } from "./skeleton";

interface HeaderProps {
  wallet: {
    publicKey: string;
    publicPhoto: string;
  };
}
export function Header({ wallet }: HeaderProps) {
  const [darkMode, setDarkMode] = useState(true);
  const session = null;
  console.log({ session });

  const { data } = useQuery({
    queryKey: ["test-data"],
    queryFn: async () => await getSampleDataServer(),
  });

  // console.log({ data });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      !darkMode ? "light" : "dark"
    );
  }, [darkMode]);

  return (
    <header className="bg-card p-4 flex justify-between items-center border-b-[1px] border-muted">
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold">
          Home
        </Link>
        <Switch
          checked={darkMode}
          onCheckedChange={(checked) => setDarkMode(checked)}
        />
      </div>

      {/* {session && session?.user ? (
        <Avatar>
          <AvatarImage
            className="object-cover"
            src={session.user.image as string}
          />
          <AvatarFallback>{session.user?.name?.[0] ?? "Gauth"}</AvatarFallback>
        </Avatar>
      ) : status === "loading" ? (
        <Skeleton className="rounded-full w-[40px] h-[40px]" />
      ) : (
        <Profile className="w-[40px]" />
      )} */}
    </header>
  );
}
