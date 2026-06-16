import type { RuminationEntry } from "@/lib/libraryReader";

const STATUS_STYLES: Record<RuminationEntry["status"], string> = {
    draft: "bg-yellow-50 text-yellow-700",
    active: "bg-green-50 text-green-700",
    resolved: "bg-blue-50 text-blue-700",
    archived: "bg-slate-100 text-slate-500",
};

interface RuminationCardProps {
    entry: RuminationEntry;
}

export function RuminationCard({ entry }: RuminationCardProps) {
    return (
        <li className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <h2 className="min-w-0 text-lg font-semibold leading-snug text-slate-900">{entry.title}</h2>
                <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[entry.status]}`}
                >
                    {entry.status}
                </span>
            </div>

            {entry.hypothesis && (
                <p className="mt-2 text-sm font-medium text-slate-700 italic">
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
