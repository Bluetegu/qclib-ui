import { notFound } from "next/navigation";
import { readLibraryEntries, readRuminationByDate } from "@/lib/libraryReader";
import { RuminationDetailView } from "@/components/RuminationDetailView";
import type { LibraryEntry } from "@/lib/libraryReader";

export const revalidate = 60;

interface PageProps {
    params: Promise<{ date: string }>;
}

function normalizeRef(value: string): string {
    return value
        .trim()
        .replace(/^\[\[/, "")
        .replace(/\]\]$/, "")
        .replace(/^\//, "")
        .replace(/\.md$/i, "");
}

function toPathFromSlug(slug: string): string {
    return slug.replace(/--/g, "/");
}

function entryKeys(entry: LibraryEntry): Set<string> {
    const keys = new Set<string>();
    const slug = normalizeRef(entry.slug);
    const path = normalizeRef(toPathFromSlug(entry.slug));
    const noIndexPath = path.replace(/\/index$/i, "");
    const basename = noIndexPath.split("/").filter(Boolean).pop() ?? "";

    keys.add(slug);
    keys.add(path);
    keys.add(`${path}.md`);
    if (noIndexPath) {
        keys.add(noIndexPath);
        keys.add(`${noIndexPath}.md`);
    }
    if (basename) {
        keys.add(basename);
    }

    return keys;
}

function resolveRelatedSource(ref: string, libraryEntries: LibraryEntry[]): LibraryEntry | null {
    const normalized = normalizeRef(ref);
    if (!normalized) return null;

    for (const candidate of libraryEntries) {
        const keys = entryKeys(candidate);
        if (keys.has(normalized)) return candidate;
    }

    return null;
}

function buildWikiLinkMap(libraryEntries: LibraryEntry[]): Record<string, string> {
    const map: Record<string, string> = {};

    for (const entry of libraryEntries) {
        const href = `/library/${entry.slug}`;
        for (const key of entryKeys(entry)) {
            map[key] = href;
            map[`/${key}`] = href;
        }
    }

    return map;
}

export default async function RuminationDetailPage({ params }: PageProps) {
    const { date } = await params;
    const rumination = readRuminationByDate(date);
    if (!rumination) notFound();

    const libraryEntries = readLibraryEntries();
    const related = rumination.relatedSources.map((slug) => {
        const entry = resolveRelatedSource(slug, libraryEntries);
        return { slug, entry };
    });
    const wikiLinks = buildWikiLinkMap(libraryEntries);

    return (
        <div className="mx-auto max-w-4xl px-6 py-10">
            <RuminationDetailView entry={rumination} relatedSources={related} wikiLinks={wikiLinks} />
        </div>
    );
}