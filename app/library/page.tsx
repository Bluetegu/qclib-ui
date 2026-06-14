import { Suspense } from "react";
import { readLibraryEntries } from "@/lib/libraryReader";
import type { Subdomain } from "@/lib/libraryReader";
import { PaperCard } from "@/components/PaperCard";
import { SearchBar } from "@/components/SearchBar";
import { TaxonomySidebar } from "@/components/TaxonomySidebar";

export const revalidate = 60;

interface PageProps {
    searchParams: Promise<{ subdomain?: string; q?: string }>;
}

export default async function LibraryPage({ searchParams }: PageProps) {
    const { subdomain, q } = await searchParams;

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

    // Filter by subdomain
    let filtered = subdomain
        ? entries.filter((e) => e.subdomain === subdomain)
        : entries;

    // Filter by search query (simple case-insensitive substring match;
    // full Fuse.js search is available via /api/search for the search bar)
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

    return (
        <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Library</h1>
                <p className="mt-1 text-neutral-500">{entries.length} papers indexed</p>
            </div>

            <Suspense>
                <SearchBar />
            </Suspense>

            {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <strong>Error loading library:</strong> {error}
                </div>
            )}

            <div className="mt-8 flex gap-8">
                <Suspense>
                    <TaxonomySidebar counts={counts} />
                </Suspense>

                <div className="flex-1 min-w-0">
                    {filtered.length === 0 ? (
                        <p className="text-sm text-neutral-500">No papers match your filters.</p>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
