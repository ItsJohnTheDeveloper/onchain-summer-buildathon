"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StytchProvider as ProviderActual } from "@stytch/nextjs";
import { createStytchUIClient } from "@stytch/nextjs/dist/index.ui";

const stytch = createStytchUIClient(
  process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN || ""
);

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <ProviderActual stytch={stytch}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ProviderActual>
  );
}
