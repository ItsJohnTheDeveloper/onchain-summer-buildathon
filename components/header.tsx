"use client";

import { useEffect, useState } from "react";
import { Switch } from "./switch";
import { Typography } from "./typography";
import Link from "next/link";
import { useStytchUser } from "@stytch/nextjs";

interface HeaderProps {
  wallet: {
    publicKey: string;
    publicPhoto: string;
  };
}
export function Header({ wallet }: HeaderProps) {
  const [darkMode, setDarkMode] = useState(true);
  const { user } = useStytchUser();

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
      {user && user.emails ? (
        <Typography variant="tag">{user.emails[0].email}</Typography>
      ) : null}
    </header>
  );
}
