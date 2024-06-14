"use client";

import { useEffect, useState } from "react";
import { Switch } from "./switch";
import { Typography } from "./typography";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { useQuery } from "@tanstack/react-query";
import { getSampleDataServer } from "@/app/_lib/get-sample-data-server";

interface HeaderProps {
  wallet: {
    publicKey: string;
    publicPhoto: string;
  };
}
export function Header({ wallet }: HeaderProps) {
  const [darkMode, setDarkMode] = useState(true);

  const { data } = useQuery({
    queryKey: ["test-data"],
    queryFn: async () => await getSampleDataServer(),
  });

  console.log({ data });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return (
    <header className="bg-card p-4 flex justify-between items-center border-b-[1px] border-muted">
      <Typography variant="h4">Social Recovery</Typography>
      <div className="flex items-center gap-4">
        <Switch
          checked={darkMode}
          onCheckedChange={(checked) => setDarkMode(checked)}
        />
        <Typography variant="h4">{wallet.publicKey}</Typography>
        <Avatar>
          <AvatarImage className="object-cover" src={wallet.publicPhoto} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
