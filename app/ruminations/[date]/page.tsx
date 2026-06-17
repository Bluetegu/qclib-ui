import { notFound } from "next/navigation";
import { readLibraryEntries, readRuminationByDate } from "@/lib/libraryReader";
import { RuminationDetailView } from "@/components/RuminationDetailView";

export const revalidate = 60;

interface PageProps {
    params: Promise<{ date: string }>;
}

export default async function RuminationDetailPage({ params }: PageProps) {
    const { date } = await params;
    const rumination = readRuminationByDate(date);
    if (!rumination) notFound();

    const libraryEntries = readLibraryEntries();
    const related = rumination.relatedSources.map((slug) => {
        const entry = libraryEntries.find((candidate) => candidate.slug === slug) ?? null;
        return { slug, entry };
    });

    return (
        <div className="mx-auto max-w-4xl px-6 py-10">
            <RuminationDetailView entry={rumination} relatedSources={related} />
        </div>
    );
}