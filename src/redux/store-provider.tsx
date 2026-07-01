"use client";

import { useRef, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "./store";

export function StoreProvider({ children }: { children: ReactNode }) {
  // Create the store instance the first time this renders (per request on the
  // server, once on the client).
  const storeRef = useRef<AppStore | null>(null);
  if (storeRef.current === null) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
