"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
let listeners: Listener[] = [];

function emit() {
  listeners.forEach((listener) => listener(toasts));
}

function addToast(type: ToastType, message: string, duration = 4000) {
  const crypto = window.crypto;
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);

  const id = `${Date.now()}-${array[0].toString(36)}`;
  toasts = [...toasts, { id, type, message }];
  emit();

  if (duration > 0) {
    setTimeout(() => dismiss(id), duration);
  }

  return id;
}

function dismiss(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

// API imperativa: pode ser chamada de qualquer lugar (handlers, services, etc),
// sem precisar estar dentro de um componente React.
export const toast = {
  success: (message: string, duration?: number) =>
    addToast("success", message, duration),
  error: (message: string, duration?: number) =>
    addToast("error", message, duration),
  info: (message: string, duration?: number) =>
    addToast("info", message, duration),
  dismiss,
};

// Hook interno usado apenas pelo <Toaster /> para se inscrever nas mudanças.
export function useToasts() {
  const [state, setState] = useState<ToastItem[]>(toasts);

  useEffect(() => {
    listeners.push(setState);
    return () => {
      listeners = listeners.filter((l) => l !== setState);
    };
  }, []);

  return state;
}
