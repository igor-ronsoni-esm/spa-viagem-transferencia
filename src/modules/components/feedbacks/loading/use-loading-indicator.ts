"use client";

import { useEffect, useState } from "react";

interface LoadingState {
  active: boolean;
  message: string;
}

const DEFAULT_MESSAGE = "Consultando ou atualizando microsserviço de integridade...";

let state: LoadingState = { active: false, message: DEFAULT_MESSAGE };

type Listener = (state: LoadingState) => void;
let listeners: Listener[] = [];

function emit() {
  listeners.forEach((listener) => listener(state));
}

function show(message: string = DEFAULT_MESSAGE) {
  state = { active: true, message };
  emit();
}

function hide() {
  state = { ...state, active: false };
  emit();
}

function isActivated() {
  return state.active;
}

export const loading = { show, hide, isActivated };

export function useLoadingIndicator() {
  const [current, setCurrent] = useState(state);

  useEffect(() => {
    listeners.push(setCurrent);
    return () => {
      listeners = listeners.filter((l) => l !== setCurrent);
    };
  }, []);

  return current;
}