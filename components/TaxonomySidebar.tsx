"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { Subdomain } from "@/lib/libraryReader";

const SUBDOMAINS: Subdomain[] = [
    "algorithms",
    "hardware",
    "error-correction",
    "cryptography",
    "simulation",
    "complexity",
    "switching",
    "games",
    "general",
];

interface TaxonomySidebarProps {
    counts: Partial<Record<Subdomain, number>>;
}

export function TaxonomySidebar({ counts }: TaxonomySidebarProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const active = searchParams.get("subdomain");

    function href(subdomain: Subdomain | null) {
        const params = new URLSearchParams(searchParams.toString());
        if (subdomain) params.set("subdomain", subdomain);
        else params.delete("subdomain");
        return `${pathname}?${params.toString()}`;
    }

    const total = Object.values(counts).reduce((a, b) => (a ?? 0) + (b ?? 0), 0);

    // Shared pill style helper
    function pillClass(isActive: boolean) {
        return `flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition whitespace-nowrap ${isActive
                ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`;
    }

    return (
        <>
            {/* ── Mobile: horizontal scrollable pill strip ── */}
            <div className="md:hidden -mx-6 px-6 overflow-x-auto">
                <div className="flex gap-1.5 pb-1">
                    <Link href={href(null)} className={pillClass(!active)}>
                        All
                        <span className={`text-xs ${!active ? "text-indigo-400" : "text-slate-400"}`}>{total}</span>
                    </Link>
                    {SUBDOMAINS.map((sd) => (
                        <Link key={sd} href={href(sd)} className={pillClass(active === sd)}>
                            <span className="capitalize">{sd.replace("-", " ")}</span>
                            {counts[sd] !== undefined && (
                                <span className={`text-xs ${active === sd ? "text-indigo-400" : "text-slate-400"}`}>
                                    {counts[sd]}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            </div>

            {/* ── Desktop: vertical sidebar ── */}
            <nav className="hidden md:block w-52 shrink-0">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Subdomains
                </p>
                <ul className="space-y-0.5">
                    <li>
                        <Link
                            href={href(null)}
                            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${!active
                                    ? "bg-indigo-50 font-semibold text-indigo-700"
                                    : "text-slate-700 hover:bg-slate-100"
                                }`}
                        >
                            <span>All</span>
                            <span className="text-xs text-slate-400">{total}</span>
                        </Link>
                    </li>
                    {SUBDOMAINS.map((sd) => (
                        <li key={sd}>
                            <Link
                                href={href(sd)}
                                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${active === sd
                                        ? "bg-indigo-50 font-semibold text-indigo-700"
                                        : "text-slate-700 hover:bg-slate-100"
                                    }`}
                            >
                                <span className="capitalize">{sd.replace("-", " ")}</span>
                                {counts[sd] !== undefined && (
                                    <span className="text-xs text-slate-400">{counts[sd]}</span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
}
