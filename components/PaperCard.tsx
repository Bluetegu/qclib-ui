import Link from "next/link";
import type { LibraryEntry } from "@/lib/libraryReader";

interface PaperCardProps {
    entry: Pick<LibraryEntry, "slug" | "title" | "summary" | "authors" | "year" | "subdomain" | "tags">;
}

const TYPE_STRUCTURAL_TAGS = new Set(["meeting", "discussion"]);

function entryTypeBadge(tags: string[]): { label: string; className: string } | null {
    if (tags.includes("meeting"))
        return { label: "Meeting", className: "bg-amber-50 text-amber-700" };
    if (tags.includes("discussion"))
        return { label: "Discussion", className: "bg-teal-50 text-teal-700" };
    return null;
}

export function PaperCard({ entry }: PaperCardProps) {
    const authorLine =
        entry.authors.length > 0
            ? entry.authors.length > 3
                ? `${entry.authors.slice(0, 3).join(", ")} et al.`
                : entry.authors.join(", ")
            : null;

    const typeBadge = entryTypeBadge(entry.tags);
    // Strip structural tags (meeting/discussion) from the visible pill list
    const visibleTags = entry.tags.filter((t) => !TYPE_STRUCTURAL_TAGS.has(t));

    return (
        <Link
            href={`/library/${entry.slug}`}
            className="group block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
        >
            <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition">{entry.title}</h3>
                {typeBadge && (
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${typeBadge.className}`}>
                        {typeBadge.label}
                    </span>
                )}
            </div>

            {entry.summary && (
                <p className="mt-1.5 text-sm text-slate-500 line-clamp-2">{entry.summary}</p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                {authorLine && <span>{authorLine}</span>}
                {entry.year && <span>{entry.year}</span>}
                {entry.subdomain && (
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-indigo-600 font-medium">
                        {entry.subdomain}
                    </span>
                )}
            </div>

            {visibleTags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                    {visibleTags.slice(0, 5).map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </Link>
    );
}
