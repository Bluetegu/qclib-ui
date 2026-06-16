"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const TAB_ICONS: Record<string, React.ReactNode> = {
    all: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
            <path fillRule="evenodd" d="M1 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3Zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V3Zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V3ZM1 9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V9Zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9Zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V9Z" clipRule="evenodd" />
        </svg>
    ),
    papers: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
            <path fillRule="evenodd" d="M4 2a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V6.621a1.5 1.5 0 0 0-.44-1.06L9.94 2.439A1.5 1.5 0 0 0 8.878 2H4Zm1 5.75a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5H5Zm0 3a.75.75 0 0 0 0 1.5h6a.75.75 0 0 0 0-1.5H5Z" clipRule="evenodd" />
        </svg>
    ),
    meetings: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M5.75 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM5 10.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM10.25 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM9.5 10.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM8 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM7.25 10.25a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0Z" />
            <path fillRule="evenodd" d="M4.75 1a.75.75 0 0 0-.75.75V3a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2V1.75a.75.75 0 0 0-1.5 0V3h-5V1.75A.75.75 0 0 0 4.75 1ZM3.5 7a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v4.5a.5.5 0 0 1-.5.5H4a.5.5 0 0 1-.5-.5V7Z" clipRule="evenodd" />
        </svg>
    ),
    discussions: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M1 8.74c0 .983.713 1.825 1.69 1.943L3 10.7v2.05a.75.75 0 0 0 1.227.578L6.133 11.5H9.5a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 9.5 3.5h-7A1.5 1.5 0 0 0 1 5v3.74Z" />
            <path d="M11 6.993V10.5a3 3 0 0 1-3 3H6.947l-.01.008-.338.278A2.493 2.493 0 0 0 9.5 15h2.367l1.906 1.628A.75.75 0 0 0 15 16v-2.697l.31-.043A2 2 0 0 0 17 11.26V8c0-.959-.68-1.76-1.573-1.944A3.002 3.002 0 0 0 11 6.993Z" />
        </svg>
    ),
};

const TABS = [
    { key: null, label: "All", iconKey: "all" },
    { key: "papers", label: "Papers", iconKey: "papers" },
    { key: "meetings", label: "Meetings", iconKey: "meetings" },
    { key: "discussions", label: "Discussions", iconKey: "discussions" },
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
            {TABS.map(({ key, label, iconKey }) => {
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
                        {TAB_ICONS[iconKey]}
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
