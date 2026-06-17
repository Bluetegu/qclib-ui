import type { RuminationEntry } from "@/lib/libraryReader";
import Link from "next/link";

const STATUS_STYLES: Record<RuminationEntry["status"], string> = {
    draft: "bg-slate-100 text-slate-600",
    active: "bg-amber-50 text-amber-700",
    validated: "bg-emerald-50 text-emerald-700",
    refuted: "bg-rose-50 text-rose-700",
    stale: "bg-slate-200 text-slate-600",
};

interface RuminationCardProps {
    entry: RuminationEntry;
}

export function RuminationCard({ entry }: RuminationCardProps) {
    return (
        <li className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <h2 className="min-w-0 text-lg font-semibold leading-snug text-slate-900">
                    <Link href={`/ruminations/${entry.filedAt}`} className="hover:text-indigo-600 transition">
                        {entry.title}
                    </Link>
                </h2>
                <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[entry.status]}`}
                >
                    {entry.status}
                </span>
            </div>

            {entry.hypothesis && (
                <p className="mt-2 rounded-lg border-l-4 border-amber-200 bg-amber-50/60 px-3 py-2 text-sm font-medium text-slate-700 italic">
                    &ldquo;{entry.hypothesis}&rdquo;
                </p>
            )}

            {entry.summary && (
                <p className="mt-2 text-sm text-slate-500">{entry.summary}</p>
            )}

            {entry.openQuestions.length > 0 && (
                <div className="mt-3">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Open questions
                    </p>
                    <ul className="list-disc list-inside space-y-0.5 text-sm text-slate-600">
                        {entry.openQuestions.map((q, i) => (
                            <li key={i}>{q}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                {entry.filedAt && <span>Filed {entry.filedAt}</span>}
                {entry.themes.map((t) => (
                    <span
                        key={t}
                        className="rounded-full bg-indigo-50 px-2 py-0.5 text-indigo-600"
                    >
                        {t}
                    </span>
                ))}
                {entry.tags.map((t) => (
                    <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-500">
                        {t}
                    </span>
                ))}
            </div>
        </li>
    );
}
