import { SearchBar } from "@/components/SearchBar";
import { DealCard } from "@/components/DealCard";
import { getDeals, getStores } from "@/lib/api/client";

export default async function HomePage() {
  let deals: Awaited<ReturnType<typeof getDeals>>["deals"] = [];
  let stores: Awaited<ReturnType<typeof getStores>> = [];

  try {
    const [dealsRes, storesRes] = await Promise.all([getDeals(8), getStores()]);
    deals = dealsRes.deals;
    stores = storesRes;
  } catch {
    // API may be offline during dev
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-emerald-950 sm:text-5xl">
          Find the <span className="text-amber-500">cheapest</span> groceries
        </h1>
        <p className="mb-8 text-lg text-emerald-700">
          Compare prices across Bangladesh&apos;s top online stores in one search.
        </p>
        <SearchBar />
      </section>

      {stores.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-emerald-900">Stores we compare</h2>
          <div className="flex flex-wrap gap-3">
            {stores.map((store) => (
              <div
                key={store.id}
                className={`rounded-xl border px-4 py-2 text-sm font-medium ${
                  store.health_ok
                    ? "border-emerald-200 bg-white text-emerald-800"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {store.name}
                {!store.health_ok && " (offline)"}
              </div>
            ))}
          </div>
        </section>
      )}

      {deals.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-emerald-900">Today&apos;s best deals</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {deals.map((deal, i) => (
              <DealCard key={i} offer={deal} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
