"use client";

import { useEffect } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
  useSwitchChain,
} from "wagmi";
import { readContractQueryOptions } from "wagmi/query";
import { useQueryClient } from "@tanstack/react-query";
import { base } from "wagmi/chains";
import { config } from "@/config/wagmi";
import { COUNTER_ADDRESS, counterAbi } from "@/config/contract";

export function IncrementButton() {
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({
        queryKey: readContractQueryOptions(config, {
          address: COUNTER_ADDRESS,
          abi: counterAbi,
          functionName: "number",
          chainId: base.id,
        }).queryKey,
      });
    }
  }, [isSuccess, queryClient]);

  if (COUNTER_ADDRESS === "0x0000000000000000000000000000000000000000") {
    return null;
  }

  if (chainId !== base.id) {
    return (
      <button
        onClick={() => switchChain({ chainId: base.id })}
        className="rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-700"
      >
        {isSwitching ? "Switching…" : "Switch to Base"}
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() =>
          writeContract({
            address: COUNTER_ADDRESS,
            abi: counterAbi,
            functionName: "increment",
            chainId: base.id,
          })
        }
        disabled={isPending || isConfirming}
        className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending
          ? "Confirm in Wallet…"
          : isConfirming
            ? "Confirming…"
            : "Increment"}
      </button>

      {isSuccess && (
        <p className="text-sm text-green-400">Confirmed!</p>
      )}

      {hash && (
        <a
          href={`https://basescan.org/tx/${hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 underline"
        >
          View on Basescan
        </a>
      )}
    </div>
  );
}
