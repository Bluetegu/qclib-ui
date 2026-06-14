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

    return (
        <nav className="w-52 shrink-0">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                Subdomains
            </p>
            <ul className="space-y-0.5">
                <li>
                    <Link
                        href={href(null)}
                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${!active
                                ? "bg-indigo-50 font-semibold text-indigo-700"
                                : "text-neutral-700 hover:bg-neutral-100"
                            }`}
                    >
                        <span>All</span>
                        <span className="text-xs text-neutral-400">
                            {Object.values(counts).reduce((a, b) => (a ?? 0) + (b ?? 0), 0)}
                        </span>
                    </Link>
                </li>
                {SUBDOMAINS.map((sd) => (
                    <li key={sd}>
                        <Link
                            href={href(sd)}
                            className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${active === sd
                                    ? "bg-indigo-50 font-semibold text-indigo-700"
                                    : "text-neutral-700 hover:bg-neutral-100"
                                }`}
                        >
                            <span className="capitalize">{sd.replace("-", " ")}</span>
                            {counts[sd] !== undefined && (
                                <span className="text-xs text-neutral-400">{counts[sd]}</span>
                            )}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
