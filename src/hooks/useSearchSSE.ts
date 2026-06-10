"use client";

import { useCallback, useEffect, useState } from "react";
import type { Offer } from "@/lib/api/types";
import { getSearchStreamUrl } from "@/lib/api/client";

interface SSEState {
  loading: boolean;
  progress: string[];
  offers: Offer[];
  storesChecked: string[];
  storesFailed: string[];
  error: string | null;
}

export function useSearchSSE(query: string, area?: string, enabled = true) {
  const [state, setState] = useState<SSEState>({
    loading: false,
    progress: [],
    offers: [],
    storesChecked: [],
    storesFailed: [],
    error: null,
  });

  const run = useCallback(() => {
    if (!query || !enabled) return;

    setState({ loading: true, progress: ["Starting search..."], offers: [], storesChecked: [], storesFailed: [], error: null });

    const es = new EventSource(getSearchStreamUrl(query, area));

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === "started") {
          setState((s) => ({ ...s, progress: [...s.progress, "Searching all stores..."] }));
        } else if (data.event === "store_start") {
          setState((s) => ({ ...s, progress: [...s.progress, `Checking ${data.store}...`] }));
        } else if (data.event === "store_done") {
          setState((s) => ({
            ...s,
            progress: [...s.progress, `${data.store}: ${data.count} products found`],
            storesChecked: [...s.storesChecked, data.store],
          }));
        } else if (data.event === "store_error") {
          setState((s) => ({
            ...s,
            progress: [...s.progress, `${data.store}: failed`],
            storesFailed: [...s.storesFailed, data.store],
          }));
        } else if (data.event === "complete") {
          setState((s) => ({
            ...s,
            loading: false,
            offers: data.offers || [],
            storesChecked: data.stores_checked || [],
            storesFailed: data.stores_failed || [],
            progress: [...s.progress, "Done!"],
          }));
          es.close();
        }
      } catch {
        setState((s) => ({ ...s, error: "Failed to parse response" }));
      }
    };

    es.onerror = () => {
      setState((s) => ({ ...s, loading: false, error: "Connection lost" }));
      es.close();
    };

    return () => es.close();
  }, [query, area, enabled]);

  useEffect(() => {
    return run();
  }, [run]);

  return state;
}
