"use client";

import { useState } from "react";
import { createSiweMessage, generateSiweNonce } from "viem/siwe";
import { useAccount, usePublicClient, useSignMessage } from "wagmi";

export function SignIn() {
  const { address, chainId, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const publicClient = usePublicClient();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authed, setAuthed] = useState(false);

  async function handleSignIn() {
    if (!isConnected || !address || !chainId || !publicClient) return;

    setIsSigningIn(true);
    try {
      const nonce = generateSiweNonce();

      const message = createSiweMessage({
        address,
        chainId,
        domain: window.location.host,
        nonce,
        uri: window.location.origin,
        version: "1",
      });

      const signature = await signMessageAsync({ message });
      const valid = await publicClient.verifySiweMessage({ message, signature });

      if (!valid) throw new Error("SIWE verification failed");

      setAuthed(true);
      // In production: send { address, message, signature } to your backend
      // to create a session / JWT
    } catch (err) {
      console.error("Sign-in failed:", err);
    } finally {
      setIsSigningIn(false);
    }
  }

  if (!isConnected) return null;

  if (authed) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-green-900/30 px-4 py-2 text-sm text-green-400">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Authenticated
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={isSigningIn}
      className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
    >
      {isSigningIn ? "Signing in…" : "Sign in with Ethereum"}
    </button>
  );
}
