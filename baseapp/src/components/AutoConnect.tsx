"use client";

import { useEffect } from "react";
import { useAccount, useConnect } from "wagmi";

export function AutoConnect() {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  useEffect(() => {
    if (isConnected) return;
    const injected = connectors.find((c) => c.type === "injected");
    if (injected) {
      connect({ connector: injected });
    }
  }, [isConnected, connect, connectors]);

  return null;
}
