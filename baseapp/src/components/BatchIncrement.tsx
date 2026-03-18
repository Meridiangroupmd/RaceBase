"use client";

import { useEffect } from "react";
import {
  useSendCalls,
  useWaitForCallsStatus,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
  useChainId,
  useSwitchChain,
} from "wagmi";
import { readContractQueryOptions } from "wagmi/query";
import { useQueryClient } from "@tanstack/react-query";
import { encodeFunctionData } from "viem";
import { base } from "wagmi/chains";
import { config } from "@/config/wagmi";
import { useWalletCapabilities } from "@/hooks/useWalletCapabilities";
import { COUNTER_ADDRESS, counterAbi } from "@/config/contract";

const counterQueryKey = readContractQueryOptions(config, {
  address: COUNTER_ADDRESS,
  abi: counterAbi,
  functionName: "number",
  chainId: base.id,
}).queryKey;

export function BatchIncrement() {
  const { isConnected } = useAccount();
  const { supportsBatching } = useWalletCapabilities();

  if (!isConnected) return null;
  if (COUNTER_ADDRESS === "0x0000000000000000000000000000000000000000") {
    return null;
  }

  return supportsBatching ? <BatchFlow /> : <SequentialFlow />;
}

function BatchFlow() {
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { data: callsResult, sendCalls, isPending } = useSendCalls();
  const { isLoading: isConfirming, isSuccess } = useWaitForCallsStatus({
    id: callsResult?.id ?? undefined,
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey: counterQueryKey });
    }
  }, [isSuccess, queryClient]);

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

  const incrementData = encodeFunctionData({
    abi: counterAbi,
    functionName: "increment",
  });

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() =>
          sendCalls({
            calls: [
              { to: COUNTER_ADDRESS, data: incrementData },
              { to: COUNTER_ADDRESS, data: incrementData },
            ],
            chainId: base.id,
          })
        }
        disabled={isPending || isConfirming}
        className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
      >
        {isPending
          ? "Confirm in Wallet…"
          : isConfirming
            ? "Confirming…"
            : "Increment ×2 (Batch)"}
      </button>
      {isSuccess && (
        <p className="text-sm text-green-400">Batch confirmed!</p>
      )}
    </div>
  );
}

function SequentialFlow() {
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({ queryKey: counterQueryKey });
    }
  }, [isSuccess, queryClient]);

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
      className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
    >
      {isPending
        ? "Confirm in Wallet…"
        : isConfirming
          ? "Confirming…"
          : "Increment (EOA)"}
    </button>
  );
}
