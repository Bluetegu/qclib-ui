import Link from "next/link";
import type { LibraryEntry } from "@/lib/libraryReader";

interface PaperCardProps {
    entry: Pick<LibraryEntry, "slug" | "title" | "summary" | "authors" | "year" | "subdomain" | "tags">;
}

export function PaperCard({ entry }: PaperCardProps) {
    const authorLine =
        entry.authors.length > 0
            ? entry.authors.length > 3
                ? `${entry.authors.slice(0, 3).join(", ")} et al.`
                : entry.authors.join(", ")
            : null;

    return (
        <Link
            href={`/library/${entry.slug}`}
            className="group block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
        >
            <h3 className="font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition">{entry.title}</h3>

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

            {entry.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                    {entry.tags.slice(0, 5).map((tag) => (
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
