"use client";

import { LoadingBackdrop } from "./LoadingBackdrop";
import { useLoadingIndicator } from "./use-loading-indicator";

export function LoadingIndicator() {
  const { active, message } = useLoadingIndicator();

  if (!active) return null;

  return (
    <LoadingBackdrop open={active} description={message} />
  );
}