"use client";

import { useReadContract } from "wagmi";
import { base } from "wagmi/chains";
import { COUNTER_ADDRESS, counterAbi } from "@/config/contract";

export function CounterDisplay() {
  const { data: count, isLoading, isError } = useReadContract({
    address: COUNTER_ADDRESS,
    abi: counterAbi,
    functionName: "number",
    chainId: base.id,
  });

  if (COUNTER_ADDRESS === "0x0000000000000000000000000000000000000000") {
    return (
      <p className="text-sm text-zinc-500">
        Contract not deployed yet. Update COUNTER_ADDRESS after deploy.
      </p>
    );
  }

  if (isLoading && count === undefined) {
    return <p className="text-zinc-400">Loading…</p>;
  }

  if (isError && count === undefined) {
    return <p className="text-red-400">Failed to read contract</p>;
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-xs uppercase tracking-wider text-zinc-500">
        Counter Value
      </p>
      <p className="text-5xl font-bold text-white">{count?.toString()}</p>
    </div>
  );
}
