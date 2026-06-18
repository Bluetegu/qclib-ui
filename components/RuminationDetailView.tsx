import Link from "next/link";
import type { LibraryEntry, RuminationEntry } from "@/lib/libraryReader";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

interface RelatedSourceItem {
    slug: string;
    entry: LibraryEntry | null;
}

interface RuminationDetailViewProps {
    entry: RuminationEntry;
    relatedSources: RelatedSourceItem[];
    wikiLinks?: Record<string, string>;
}

function statusClass(status: RuminationEntry["status"]) {
    switch (status) {
        case "active":
            return "bg-amber-50 text-amber-700";
        case "validated":
            return "bg-emerald-50 text-emerald-700";
        case "refuted":
            return "bg-rose-50 text-rose-700";
        case "stale":
            return "bg-slate-200 text-slate-600";
        default:
            return "bg-slate-100 text-slate-600";
    }
}

export function RuminationDetailView({ entry, relatedSources, wikiLinks }: RuminationDetailViewProps) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Rumination</p>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{entry.title}</h1>
                    <p className="mt-2 text-sm text-slate-500">Filed {entry.filedAt}</p>
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize ${statusClass(entry.status)}`}>
                    {entry.status}
                </span>
            </div>

            {entry.summary && <p className="mt-4 text-base text-slate-600">{entry.summary}</p>}

            {entry.hypothesis && (
                <blockquote className="mt-6 rounded-xl border border-amber-200 bg-amber-50/70 p-5 text-lg font-medium leading-relaxed text-slate-800">
                    &ldquo;{entry.hypothesis}&rdquo;
                </blockquote>
            )}

            {entry.content && (
                <section className="mt-8">
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-400">Markdown body</h2>
                    <div className="rounded-xl border border-slate-200 bg-white p-5">
                        <MarkdownRenderer content={entry.content} wikiLinks={wikiLinks} />
                    </div>
                </section>
            )}

            {entry.openQuestions.length > 0 && (
                <section className="mt-8">
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-400">Open questions</h2>
                    <ul className="space-y-2 text-sm text-slate-600">
                        {entry.openQuestions.map((question) => (
                            <li key={question} className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                                {question}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {relatedSources.length > 0 && (
                <section className="mt-8">
                    <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-400">Related sources</h2>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {relatedSources.map(({ slug, entry: related }) =>
                            related ? (
                                <Link
                                    key={slug}
                                    href={`/library/${related.slug}`}
                                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
                                >
                                    <p className="text-sm font-medium text-slate-900">{related.title}</p>
                                    <p className="mt-1 text-xs text-slate-500">{related.slug}</p>
                                </Link>
                            ) : (
                                <div key={slug} className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                                    <p className="text-sm font-medium text-slate-500">{slug}</p>
                                    <p className="mt-1 text-xs text-slate-400">Unresolved related source</p>
                                </div>
                            )
                        )}
                    </div>
                </section>
            )}

            {entry.themes.length > 0 && (
                <section className="mt-8 flex flex-wrap gap-2">
                    {entry.themes.map((theme) => (
                        <span key={theme} className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                            {theme}
                        </span>
                    ))}
                </section>
            )}
        </div>
    );
}