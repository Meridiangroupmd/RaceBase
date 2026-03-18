"use client";

import { useEffect, useState, type ReactNode } from "react";

function isInsideBaseApp(): boolean {
  if (typeof window === "undefined") return false;

  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("coinbasewallet") || ua.includes("coinbase") || ua.includes("base.app")) {
    return true;
  }

  const eth = (window as unknown as Record<string, unknown>).ethereum;
  if (eth && typeof eth === "object" && (eth as Record<string, unknown>).isCoinbaseWallet) {
    return true;
  }

  const providers = (eth as Record<string, unknown>)?.providers;
  if (Array.isArray(providers)) {
    return providers.some((p: Record<string, unknown>) => p.isCoinbaseWallet);
  }

  return false;
}

export function BaseAppGate({ children }: { children: ReactNode }) {
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAllowed(isInsideBaseApp());
      setChecked(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  if (!checked) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-[#0a0a14]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 bg-[#0a0a14] px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0052FF]">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" fill="white" />
            <circle cx="16" cy="16" r="10" fill="#0052FF" />
            <circle cx="12.5" cy="14" r="1.5" fill="white" />
            <circle cx="19.5" cy="14" r="1.5" fill="white" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white">
          Race<span style={{ color: "#0052FF" }}>Base</span>
        </h1>
        <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
          This app is designed to run inside the <span className="font-semibold text-white">Base App</span>. Please open it from your Base App to continue.
        </p>
        <a
          href="https://base.org/download"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 rounded-full bg-[#0052FF] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0040DD]"
        >
          Get Base App
        </a>
      </div>
    );
  }

  return <>{children}</>;
}
