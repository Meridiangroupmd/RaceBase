"use client";

import { useEffect } from "react";
import sdk from "@farcaster/frame-sdk";

export function FrameReady() {
  useEffect(() => {
    sdk.actions.ready().catch(() => {});
  }, []);

  return null;
}
