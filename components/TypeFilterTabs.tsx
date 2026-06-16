"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const TABS = [
    { key: null, label: "All" },
    { key: "papers", label: "Papers" },
    { key: "meetings", label: "Meetings" },
    { key: "discussions", label: "Discussions" },
] as const;

interface TypeFilterTabsProps {
    counts: {
        all: number;
        papers: number;
        meetings: number;
        discussions: number;
    };
}

export function TypeFilterTabs({ counts }: TypeFilterTabsProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const active = searchParams.get("type");

    function href(type: string | null) {
        const params = new URLSearchParams(searchParams.toString());
        if (type) params.set("type", type);
        else params.delete("type");
        return `${pathname}?${params.toString()}`;
    }

    const countFor = (key: string | null) => {
        if (!key) return counts.all;
        return counts[key as keyof typeof counts] ?? 0;
    };

    return (
        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-0.5">
            {TABS.map(({ key, label }) => {
                const isActive = active === key || (!active && key === null);
                return (
                    <Link
                        key={label}
                        href={href(key)}
                        className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${isActive
                            ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                            }`}
                    >
                        {label}
                        <span className={`text-xs ${isActive ? "text-indigo-400" : "text-slate-400"}`}>
                            {countFor(key)}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
}
