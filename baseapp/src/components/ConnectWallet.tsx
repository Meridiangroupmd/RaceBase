"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export function ConnectWallet() {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  if (isReconnecting) {
    return (
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3 rounded-full bg-[#0052FF] px-5 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
            <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
              <path d="M14 0C6.268 0 0 6.268 0 14s6.268 14 14 14 14-6.268 14-14S21.732 0 14 0z" fill="#0052FF"/>
              <path d="M14 5.25a8.75 8.75 0 100 17.5 8.75 8.75 0 000-17.5zm-2.917 6.417a1.167 1.167 0 112.334 0 1.167 1.167 0 01-2.334 0zm4.667 0a1.167 1.167 0 112.333 0 1.167 1.167 0 01-2.333 0z" fill="white"/>
            </svg>
          </div>
          <span className="font-mono text-sm font-medium text-white">
            {address?.slice(0, 6)}…{address?.slice(-4)}
          </span>
        </div>
        <button
          onClick={() => disconnect()}
          className="text-sm text-zinc-500 transition-colors hover:text-white"
        >
          Disconnect
        </button>
      </div>
    );
  }

  const coinbaseConnector = connectors.find(
    (c) => c.name === "Coinbase Wallet" || c.id === "coinbaseWalletSDK"
  );
  const fallbackConnector = connectors[0];
  const connector = coinbaseConnector ?? fallbackConnector;

  return (
    <button
      onClick={() => connect({ connector })}
      disabled={isConnecting}
      className="flex items-center gap-3 rounded-full bg-[#0052FF] px-7 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-[#0040DD] hover:shadow-blue-500/40 active:scale-[0.97] disabled:opacity-60"
    >
      {isConnecting ? (
        <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      ) : (
        <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
          <path d="M14 0C6.268 0 0 6.268 0 14s6.268 14 14 14 14-6.268 14-14S21.732 0 14 0z" fill="white"/>
          <path d="M14 5.25a8.75 8.75 0 100 17.5 8.75 8.75 0 000-17.5zm-2.917 6.417a1.167 1.167 0 112.334 0 1.167 1.167 0 01-2.334 0zm4.667 0a1.167 1.167 0 112.333 0 1.167 1.167 0 01-2.333 0z" fill="#0052FF"/>
        </svg>
      )}
      {isConnecting ? "Connecting…" : "Connect Wallet"}
    </button>
  );
}
