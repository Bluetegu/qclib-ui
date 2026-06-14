"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";

interface SearchBarProps {
    placeholder?: string;
    paramName?: string;
}

export function SearchBar({
    placeholder = "Search papers, topics, authors…",
    paramName = "q",
}: SearchBarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const params = new URLSearchParams(searchParams.toString());
            const value = e.target.value.trim();
            if (value) params.set(paramName, value);
            else params.delete(paramName);
            startTransition(() => {
                router.replace(`${pathname}?${params.toString()}`);
            });
        },
        [router, pathname, searchParams, paramName]
    );

    return (
        <div className="relative w-full max-w-xl">
            <svg
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
                type="search"
                defaultValue={searchParams.get(paramName) ?? ""}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pl-9 pr-4 text-sm text-neutral-800 placeholder-neutral-400 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
            {isPending && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                    …
                </span>
            )}
        </div>
    );
}
