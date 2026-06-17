import { PaperCard } from "@/components/PaperCard";
import { RuminationCard } from "@/components/RuminationCard";
import { RuminationDetailView } from "@/components/RuminationDetailView";
import type { LibraryEntry, RuminationEntry } from "@/lib/libraryReader";

// Force dynamic rendering — prevents this page from being statically prerendered
export const dynamic = "force-dynamic";

export default function DevCardsPage() {
    return (
        <div className="mx-auto max-w-6xl px-5 py-10 space-y-10">
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
                Dev preview — not linked from anywhere in the app
            </div>
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Card Style Preview</h1>
            </div>

            {GROUPS.map(({ label, entries }) => (
                <section key={label}>
                    <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {entries.map((entry) => (
                            <PaperCard key={entry.slug} entry={entry} />
                        ))}
                    </div>
                </section>
            ))}

            <section>
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">Rumination cards</h2>
                <ul className="space-y-5">
                    {RUMINATIONS.map((entry) => (
                        <RuminationCard key={entry.slug} entry={entry} />
                    ))}
                </ul>
            </section>

            <section>
                <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-400">Rumination detail pages</h2>
                <div className="space-y-8">
                    {RUMINATIONS.map((entry) => (
                        <RuminationDetailView
                            key={entry.slug}
                            entry={entry}
                            relatedSources={entry.relatedSources.map((slug) => ({
                                slug,
                                entry: LIBRARY_ENTRIES.find((candidate) => candidate.slug === slug) ?? null,
                            }))}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Fixture data
// ---------------------------------------------------------------------------

function paper(overrides: Partial<LibraryEntry> & { slug: string; title: string }): LibraryEntry {
    return {
        filePath: "",
        pageType: "source",
        summary: "A concise summary of the paper describing the key contribution and motivation behind the research.",
        authors: ["Alice Quantum", "Bob Entangle"],
        year: 2024,
        subdomain: "algorithms",
        tags: [],
        sourceUrl: null,
        codeUrl: null,
        filedAt: "2024-06-01",
        content: "",
        ...overrides,
    };
}

const GROUPS: { label: string; entries: LibraryEntry[] }[] = [
    {
        label: "Type variants",
        entries: [
            paper({ slug: "paper-1", title: "Variational Quantum Eigensolver for Molecular Simulation", tags: [] }),
            paper({ slug: "meeting-1", title: "Weekly sync: error correction progress", tags: ["meeting"], subdomain: "error-correction", authors: ["Alice Quantum", "Bob Entangle", "Carol Hadamard"] }),
            paper({ slug: "discussion-1", title: "Discussion: is fault-tolerant QC achievable before 2030?", tags: ["discussion"], subdomain: "complexity", authors: ["Dave Qubit"] }),
        ],
    },
    {
        label: "Title length stress test",
        entries: [
            paper({ slug: "short", title: "Shor's Algorithm", tags: [] }),
            paper({
                slug: "medium",
                title: "Quantum Error Correction with Surface Codes at Low Physical Error Rates",
                tags: [],
                subdomain: "error-correction",
            }),
            paper({
                slug: "long",
                title: "A Comprehensive Survey of Near-Term Quantum Advantage Proposals Across Variational, Annealing, and Sampling Paradigms for Industrial Optimisation Problems",
                tags: [],
                subdomain: "simulation",
            }),
        ],
    },
    {
        label: "Author variants",
        entries: [
            paper({ slug: "no-authors", title: "Paper with no authors", authors: [], tags: [] }),
            paper({ slug: "one-author", title: "Single-author paper", authors: ["Eve Bloch"], tags: [] }),
            paper({ slug: "many-authors", title: "Large collaboration paper", authors: ["A. One", "B. Two", "C. Three", "D. Four", "E. Five"], tags: [] }),
        ],
    },
    {
        label: "Subdomain variants",
        entries: (["algorithms", "hardware", "error-correction", "cryptography", "simulation", "complexity", "switching", "games", "general"] as const).map(
            (sd) => paper({ slug: `sd-${sd}`, title: `Example entry — ${sd}`, subdomain: sd, tags: [] })
        ),
    },
    {
        label: "No summary / no metadata",
        entries: [
            paper({ slug: "no-summary", title: "Entry with no summary", summary: "", tags: [] }),
            paper({ slug: "no-year", title: "Entry with no year", year: null, tags: [] }),
            paper({ slug: "no-subdomain", title: "Entry with no subdomain", subdomain: null, tags: [] }),
            paper({ slug: "no-anything", title: "Bare entry", summary: "", authors: [], year: null, subdomain: null, tags: [] }),
        ],
    },
    {
        label: "Tags",
        entries: [
            paper({ slug: "few-tags", title: "Entry with a few tags", tags: ["NISQ", "variational"] }),
            paper({ slug: "many-tags", title: "Entry with many tags (capped at 5)", tags: ["NISQ", "variational", "VQE", "ansatz", "gradient-free", "barren-plateau", "noise"] }),
            paper({ slug: "meeting-tags", title: "Meeting with extra tags", tags: ["meeting", "error-correction", "Q2-2024"], subdomain: "error-correction" }),
        ],
    },
];

function rumination(overrides: Partial<RuminationEntry> & { slug: string; title: string }): RuminationEntry {
    return {
        pageType: "rumination",
        filePath: "",
        summary: "A working synthesis exploring the intersection of two research threads.",
        hypothesis: "The phenomenon observed in hardware experiments may be a special case of a broader theoretical result.",
        status: "draft",
        themes: ["error-correction", "hardware"],
        openQuestions: ["Does this hold at scale?", "What are the noise thresholds?"],
        relatedSources: ["2026-05-22980-automatic-dequantization"],
        tags: [],
        filedAt: "2026-06-01",
        content: `## Core logic trace

We model the error channel as a weighted graph and compare decoder behavior under topology-preserving perturbations.

- baseline decoder: matching
- candidate decoder: biased matching

### Sandbox checks

1. Simulate 1000 rounds with fixed bias
2. Compare threshold drift under correlated noise
3. Validate stability for small lattice sizes

Inline math: $p_{th} \approx 1.8\%$.

\`\`\`ts
const threshold = simulateThreshold({ lattice: 13, bias: 4.0 });
console.log(threshold);
\`\`\`
`,
        ...overrides,
    };
}

const RUMINATIONS: RuminationEntry[] = [
    rumination({ slug: "r-active", filedAt: "2026-06-01", title: "Surface codes may exhibit threshold improvement under biased noise models", status: "active", themes: ["error-correction", "hardware"], openQuestions: ["Does bias magnitude affect the threshold monotonically?", "Can this be verified on current superconducting hardware?", "What is the optimal decoder for biased surface codes?"], relatedSources: ["2026-05-22980-automatic-dequantization", "2026-05-23012-biased-noise-thresholds"] }),
    rumination({ slug: "r-draft", filedAt: "2026-06-02", title: "Exploring connections between quantum walk speedup and graph isomorphism", status: "draft", themes: ["algorithms", "complexity"], hypothesis: "Quantum walks on Cayley graphs may encode group structure in a way that breaks isomorphism symmetry.", content: "### Graph note\n\nWe compared spectra for isomorphic vs non-isomorphic constructions and saw partial separation for bounded degree families." }),
    rumination({ slug: "r-resolved", filedAt: "2026-06-03", title: "Fault-tolerant magic state distillation cost reduction via concatenation", status: "validated", themes: ["error-correction"], openQuestions: [], tags: ["closed", "published"], content: "Validation complete. Results now tracked in follow-up source notes." }),
    rumination({ slug: "r-archived", filedAt: "2026-06-04", title: "Early speculation on topological codes for photonic platforms", status: "stale", hypothesis: "", summary: "", themes: [], openQuestions: [], tags: [], content: "No longer active after updated hardware constraints." }),
    rumination({ slug: "r-minimal", filedAt: "2026-06-05", title: "Minimal rumination — no hypothesis, no questions, no themes", hypothesis: "", openQuestions: [], themes: [], tags: [], status: "draft", content: "Short markdown body to validate minimal layout." }),
];

const LIBRARY_ENTRIES: LibraryEntry[] = [
    paper({ slug: "2026-05-22980-automatic-dequantization", title: "Automatic Dequantization for Structured Sampling Problems", summary: "A mock library entry used to preview related-source links.", tags: ["dequantization"] }),
    paper({ slug: "2026-05-23012-biased-noise-thresholds", title: "Biased Noise Thresholds in Surface Code Decoding", summary: "Another mock entry for relationship previews.", subdomain: "error-correction", tags: ["threshold", "surface-code"] }),
];

