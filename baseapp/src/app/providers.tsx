"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { base } from "@privy-io/chains";
import { type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        appearance: {
          walletList: ["base_account"],
          showWalletLoginFirst: true,
        },
        defaultChain: base,
      }}
    >
      {children}
    </PrivyProvider>
  );
}
