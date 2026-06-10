"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { DealCard } from "@/components/DealCard";
import { SearchBar } from "@/components/SearchBar";
import { SearchProgress } from "@/components/SearchProgress";
import { useSearchSSE } from "@/hooks/useSearchSSE";
import { searchProducts } from "@/lib/api/client";
import type { Offer } from "@/lib/api/types";

function SearchResults() {
  const params = useSearchParams();
  const q = params.get("q") || "";
  const area = params.get("area") || undefined;
  const [offers, setOffers] = useState<Offer[]>([]);
  const [cached, setCached] = useState(false);
  const [sort, setSort] = useState("unit_price");
  const [useStream, setUseStream] = useState(false);

  const sse = useSearchSSE(q, area, useStream);

  useEffect(() => {
    if (!q) return;
    setUseStream(false);
    searchProducts(q, { area, sort, force_refresh: false })
      .then((res) => {
        if (res.cached && res.offers.length > 0) {
          setOffers(res.offers);
          setCached(true);
        } else {
          setUseStream(true);
        }
      })
      .catch(() => setUseStream(true));
  }, [q, area, sort]);

  useEffect(() => {
    if (sse.offers.length > 0) {
      setOffers(sse.offers);
      setCached(false);
    }
  }, [sse.offers]);

  const sorted = [...offers].sort((a, b) => {
    if (sort === "price") {
      return Number(a.price_bdt) - Number(b.price_bdt);
    }
    const au = Number(a.unit_price_bdt ?? a.price_bdt);
    const bu = Number(b.unit_price_bdt ?? b.price_bdt);
    return au - bu;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <SearchBar defaultQuery={q} defaultArea={area || "Dhaka"} />
      </div>

      {q && (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-xl font-bold text-emerald-950">
              Results for &ldquo;{q}&rdquo;
              {cached && <span className="ml-2 text-sm font-normal text-emerald-600">(cached)</span>}
            </h1>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-emerald-200 px-3 py-1.5 text-sm"
            >
              <option value="unit_price">Lowest unit price</option>
              <option value="price">Lowest price</option>
            </select>
          </div>

          {(sse.loading || sse.progress.length > 0) && (
            <div className="mb-6">
              <SearchProgress messages={sse.progress} loading={sse.loading} />
            </div>
          )}

          {sorted.length === 0 && !sse.loading ? (
            <p className="text-emerald-700">No products found. Try a different search term.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sorted.map((offer, i) => (
                <DealCard key={`${offer.store_slug}-${i}`} offer={offer} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-emerald-700">Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
