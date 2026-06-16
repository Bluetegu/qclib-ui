import Link from "next/link";
import { readLibraryStats } from "@/lib/libraryReader";
import { PaperCard } from "@/components/PaperCard";
import { SearchBar } from "@/components/SearchBar";
import { Suspense } from "react";

export const revalidate = 60;

export default function DashboardPage() {
  let stats: ReturnType<typeof readLibraryStats> | null = null;
  let error: string | null = null;

  try {
    stats = readLibraryStats();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load library";
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Quantum Computing Library</h1>
        <p className="mt-1.5 text-slate-500">Research knowledge base maintained by openclaw</p>
      </div>

      <Suspense>
        <SearchBar />
      </Suspense>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <strong>Error loading library:</strong> {error}
        </div>
      )}

      {stats && (
        <>
          <section>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">Overview</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <StatCard label="Total items" value={stats.total} />
              {Object.entries(stats.bySubdomain).map(([sd, count]) => (
                <Link key={sd} href={`/library?subdomain=${sd}`}>
                  <StatCard label={sd.replace("-", " ")} value={count} clickable />
                </Link>
              ))}
            </div>
          </section>

          {stats.recent.length > 0 && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Recent Additions</h2>
                <Link href="/library" className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline transition">
                  View all →
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stats.recent.map((entry) => (
                  <PaperCard key={entry.slug} entry={entry} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  clickable = false,
}: {
  label: string;
  value: number;
  clickable?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${clickable ? "transition hover:border-indigo-300 hover:shadow-md cursor-pointer" : ""
        }`}
    >
      <p className="text-2xl font-bold text-indigo-600">{value}</p>
      <p className="mt-0.5 text-xs capitalize text-slate-500">{label}</p>
    </div>
  );
}
