import { Suspense } from "react";
import { readLibraryEntries } from "@/lib/libraryReader";
import type { Subdomain } from "@/lib/libraryReader";
import { PaperCard } from "@/components/PaperCard";
import { SearchBar } from "@/components/SearchBar";
import { TaxonomySidebar } from "@/components/TaxonomySidebar";
import { TypeFilterTabs } from "@/components/TypeFilterTabs";

export const revalidate = 60;

interface PageProps {
    searchParams: Promise<{ subdomain?: string; q?: string; type?: string }>;
}

export default async function LibraryPage({ searchParams }: PageProps) {
    const { subdomain, q, type } = await searchParams;

    let entries = readLibraryEntries();
    let error: string | null = null;

    try {
        entries = readLibraryEntries();
    } catch (e) {
        error = e instanceof Error ? e.message : "Failed to load library";
        entries = [];
    }

    // Build subdomain counts for sidebar
    const counts: Partial<Record<Subdomain, number>> = {};
    for (const e of entries) {
        if (e.subdomain) counts[e.subdomain] = (counts[e.subdomain] ?? 0) + 1;
    }

    // Build type counts for tabs
    const typeCounts = {
        all: entries.length,
        papers: entries.filter((e) => !e.tags.includes("meeting") && !e.tags.includes("discussion")).length,
        meetings: entries.filter((e) => e.tags.includes("meeting")).length,
        discussions: entries.filter((e) => e.tags.includes("discussion")).length,
    };

    // Filter by type
    let filtered = entries;
    if (type === "papers") {
        filtered = filtered.filter((e) => !e.tags.includes("meeting") && !e.tags.includes("discussion"));
    } else if (type === "meetings") {
        filtered = filtered.filter((e) => e.tags.includes("meeting"));
    } else if (type === "discussions") {
        filtered = filtered.filter((e) => e.tags.includes("discussion"));
    }

    // Filter by subdomain
    if (subdomain) {
        filtered = filtered.filter((e) => e.subdomain === subdomain);
    }

    // Filter by search query
    if (q) {
        const lower = q.toLowerCase();
        filtered = filtered.filter(
            (e) =>
                e.title.toLowerCase().includes(lower) ||
                e.summary.toLowerCase().includes(lower) ||
                e.authors.some((a) => a.toLowerCase().includes(lower)) ||
                e.tags.some((t) => t.toLowerCase().includes(lower))
        );
    }

    // Sort newest first by filedAt (entries without a date go last)
    filtered = [...filtered].sort((a, b) => {
        const aDate = a.filedAt ?? "";
        const bDate = b.filedAt ?? "";
        const byDate = bDate.localeCompare(aDate);
        if (byDate !== 0) return byDate;
        return a.title.localeCompare(b.title);
    });

    return (
        <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Library</h1>
                <p className="mt-1 text-slate-500">{entries.length} items indexed</p>
            </div>

            <Suspense>
                <SearchBar />
            </Suspense>

            <Suspense>
                <TypeFilterTabs counts={typeCounts} />
            </Suspense>

            {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <strong>Error loading library:</strong> {error}
                </div>
            )}

            <div className="mt-6 flex flex-col gap-6 md:mt-8 md:flex-row md:gap-8">
                <Suspense>
                    <TaxonomySidebar counts={counts} />
                </Suspense>

                <div className="flex-1 min-w-0">
                    {filtered.length === 0 ? (
                        <p className="text-sm text-slate-500">No items match your filters.</p>
                    ) : (
                        <div className="space-y-4">
                            {filtered.map((entry) => (
                                <PaperCard key={entry.slug} entry={entry} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
