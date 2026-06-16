import React from "react";
import Link from "next/link";
import type { LibraryEntry } from "@/lib/libraryReader";

interface PaperCardProps {
    entry: Pick<LibraryEntry, "slug" | "title" | "summary" | "authors" | "year" | "subdomain" | "tags">;
}

const TYPE_STRUCTURAL_TAGS = new Set(["meeting", "discussion"]);

function entryTypeBadge(tags: string[]): { label: string; icon: React.ReactNode; className: string } | null {
    if (tags.includes("meeting"))
        return {
            label: "Meeting",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                    <path d="M5.75 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM5 10.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM10.25 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM9.5 10.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM8 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM7.25 10.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0Z" />
                    <path fillRule="evenodd" d="M4.75 1a.75.75 0 0 0-.75.75V3a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2V1.75a.75.75 0 0 0-1.5 0V3h-5V1.75A.75.75 0 0 0 4.75 1ZM3.5 7a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v4.5a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V7Z" clipRule="evenodd" />
                </svg>
            ),
            className: "bg-amber-50 text-amber-700",
        };
    if (tags.includes("discussion"))
        return {
            label: "Discussion",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                    <path d="M1 8.74c0 .983.713 1.825 1.69 1.943L3 10.7v2.05a.75.75 0 0 0 1.227.578L6.133 11.5H9.5a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 9.5 3.5h-7A1.5 1.5 0 0 0 1 5v3.74Z" />
                    <path d="M11 6.993V10.5a3 3 0 0 1-3 3H6.947l-.01.008-.338.278A2.493 2.493 0 0 0 9.5 15h2.367l1.906 1.628A.75.75 0 0 0 15 16v-2.697l.31-.043A2 2 0 0 0 17 11.26V8c0-.959-.68-1.76-1.573-1.944A3.002 3.002 0 0 0 11 6.993Z" />
                </svg>
            ),
            className: "bg-teal-50 text-teal-700",
        };
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
                    <span className={`shrink-0 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${typeBadge.className}`}>
                        {typeBadge.icon}
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
