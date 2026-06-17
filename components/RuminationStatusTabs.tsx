"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { RuminationStatus } from "@/lib/libraryReader";

const TABS: Array<{ key: RuminationStatus | null; label: string }> = [
    { key: null, label: "All" },
    { key: "active", label: "Active" },
    { key: "draft", label: "Draft" },
    { key: "validated", label: "Validated" },
    { key: "refuted", label: "Refuted" },
    { key: "stale", label: "Stale" },
];

interface RuminationStatusTabsProps {
    counts: Record<RuminationStatus, number>;
}

export function RuminationStatusTabs({ counts }: RuminationStatusTabsProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const active = searchParams.get("status");

    function href(status: RuminationStatus | null) {
        const params = new URLSearchParams(searchParams.toString());
        if (status) params.set("status", status);
        else params.delete("status");
        return `${pathname}?${params.toString()}`;
    }

    const countFor = (key: RuminationStatus | null) => {
        if (!key) return Object.values(counts).reduce((sum, value) => sum + value, 0);
        return counts[key];
    };

    return (
        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-0.5">
            {TABS.map(({ key, label }) => {
                const isActive = active === key || (!active && key === null);
                return (
                    <Link
                        key={label}
                        href={href(key)}
                        className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition whitespace-nowrap ${
                            isActive
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