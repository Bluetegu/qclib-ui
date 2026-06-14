import { notFound } from "next/navigation";
import Link from "next/link";
import { readLibraryEntries } from "@/lib/libraryReader";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

export const revalidate = 60;

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function LibraryEntryPage({ params }: PageProps) {
    const { slug } = await params;
    // Slugs use '--' as path separator (see libraryReader.ts toSlug)
    const entries = readLibraryEntries();
    const entry = entries.find((e) => e.slug === slug);

    if (!entry) notFound();

    const authorLine =
        entry.authors.length > 0 ? entry.authors.join(", ") : null;

    return (
        <div className="mx-auto max-w-4xl px-6 py-10">
            {/* Breadcrumb */}
            <nav className="mb-6 flex items-center gap-2 text-sm text-neutral-500">
                <Link href="/library" className="hover:text-indigo-600 transition">
                    Library
                </Link>
                {entry.subdomain && (
                    <>
                        <span>/</span>
                        <Link
                            href={`/library?subdomain=${entry.subdomain}`}
                            className="capitalize hover:text-indigo-600 transition"
                        >
                            {entry.subdomain.replace("-", " ")}
                        </Link>
                    </>
                )}
                <span>/</span>
                <span className="truncate text-neutral-700">{entry.title}</span>
            </nav>

            {/* Header */}
            <header className="mb-8 space-y-3">
                <h1 className="text-3xl font-bold leading-tight">{entry.title}</h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500">
                    {authorLine && <span>{authorLine}</span>}
                    {entry.year && <span>{entry.year}</span>}
                    {entry.filedAt && <span>Filed {entry.filedAt}</span>}
                </div>

                {entry.summary && (
                    <p className="text-neutral-600 leading-relaxed">{entry.summary}</p>
                )}

                <div className="flex flex-wrap gap-2">
                    {entry.subdomain && (
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                            {entry.subdomain}
                        </span>
                    )}
                    {entry.tags.map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                    {entry.sourceUrl && (
                        <a
                            href={entry.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline"
                        >
                            Source paper ↗
                        </a>
                    )}
                    {entry.codeUrl && (
                        <a
                            href={entry.codeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:underline"
                        >
                            Code ↗
                        </a>
                    )}
                </div>
            </header>

            {/* Markdown body */}
            <MarkdownRenderer content={entry.content} />
        </div>
    );
}
