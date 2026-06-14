import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Subdomain =
    | "algorithms"
    | "hardware"
    | "error-correction"
    | "cryptography"
    | "simulation"
    | "complexity"
    | "switching"
    | "games"
    | "general";

export interface LibraryEntry {
    slug: string;         // URL-safe identifier derived from the file path
    filePath: string;     // Absolute path to the source file
    pageType: string;
    title: string;
    summary: string;
    authors: string[];
    year: number | null;
    subdomain: Subdomain | null;
    tags: string[];
    sourceUrl: string | null;
    codeUrl: string | null;
    filedAt: string | null;
    content: string;      // Raw markdown body (without frontmatter)
}

export interface RuminationEntry {
    slug: string;
    filePath: string;
    title: string;
    summary: string;
    hypothesis: string;
    status: "draft" | "active" | "resolved" | "archived";
    themes: string[];
    openQuestions: string[];
    tags: string[];
    filedAt: string | null;
    content: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SKIP_DIRS = new Set([
    "concepts",
    "entities",
    "reports",
    ".openclaw-wiki",
    "_attachments",
    "_views",
]);

const VALID_SUBDOMAINS = new Set<Subdomain>([
    "algorithms",
    "hardware",
    "error-correction",
    "cryptography",
    "simulation",
    "complexity",
    "switching",
    "games",
    "general",
]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function dataRoot(): string {
    const root = process.env.QCLIB_DATA_ROOT;
    if (!root) throw new Error("QCLIB_DATA_ROOT environment variable is not set");
    return root;
}

/** Recursively collect all .md files under a directory, skipping excluded dirs. */
function collectMarkdownFiles(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];
    const results: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
            if (!SKIP_DIRS.has(entry.name)) {
                results.push(...collectMarkdownFiles(path.join(dir, entry.name)));
            }
        } else if (entry.isFile() && entry.name.endsWith(".md")) {
            results.push(path.join(dir, entry.name));
        }
    }
    return results;
}

/** Derive a stable URL slug from a file path relative to the data root. */
function toSlug(filePath: string, root: string): string {
    return filePath
        .replace(root, "")
        .replace(/^\//, "")
        .replace(/\.md$/, "")
        .replace(/\//g, "--");
}

function toArray(value: unknown): string[] {
    if (Array.isArray(value)) return value.map(String);
    if (typeof value === "string" && value.length) return [value];
    return [];
}

function toSubdomain(value: unknown): Subdomain | null {
    if (typeof value === "string" && VALID_SUBDOMAINS.has(value as Subdomain)) {
        return value as Subdomain;
    }
    return null;
}

function toYear(value: unknown): number | null {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
        const n = parseInt(value, 10);
        if (!isNaN(n)) return n;
    }
    return null;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Read and parse all library entries from sources/QC/. */
export function readLibraryEntries(): LibraryEntry[] {
    const root = dataRoot();
    const sourcesDir = path.join(root, "sources", "QC");
    const files = collectMarkdownFiles(sourcesDir);

    return files.map((filePath) => {
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(raw);

        const authors =
            toArray(data.authors).length > 0
                ? toArray(data.authors)
                : toArray(data.participants).length > 0
                    ? toArray(data.participants)
                    : toArray(data.speaker);

        return {
            slug: toSlug(filePath, root),
            filePath,
            pageType: typeof data.pageType === "string" ? data.pageType : "source",
            title: typeof data.title === "string" ? data.title : path.basename(filePath, ".md"),
            summary: typeof data.summary === "string" ? data.summary : "",
            authors,
            year: toYear(data.year ?? data.date),
            subdomain: toSubdomain(data.subdomain),
            tags: toArray(data.tags),
            sourceUrl: typeof data.sourceUrl === "string" ? data.sourceUrl : null,
            codeUrl: typeof data.codeUrl === "string" ? data.codeUrl : null,
            filedAt: typeof data.filedAt === "string" ? data.filedAt : null,
            content: content.trim(),
        };
    });
}

/** Read and parse all rumination files from syntheses/QC/. */
export function readRuminations(): RuminationEntry[] {
    const root = dataRoot();
    const synthesisDir = path.join(root, "syntheses", "QC");

    if (!fs.existsSync(synthesisDir)) return [];

    const files = fs
        .readdirSync(synthesisDir)
        .filter((f) => f.startsWith("rumination-") && f.endsWith(".md"))
        .map((f) => path.join(synthesisDir, f));

    const validStatuses = new Set(["draft", "active", "resolved", "archived"]);

    return files.map((filePath) => {
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(raw);

        const status = validStatuses.has(data.status) ? data.status : "draft";

        return {
            slug: toSlug(filePath, root),
            filePath,
            title: typeof data.title === "string" ? data.title : path.basename(filePath, ".md"),
            summary: typeof data.summary === "string" ? data.summary : "",
            hypothesis: typeof data.hypothesis === "string" ? data.hypothesis : "",
            status,
            themes: toArray(data.themes),
            openQuestions: toArray(data.openQuestions),
            tags: toArray(data.tags),
            filedAt: typeof data.filedAt === "string" ? data.filedAt : null,
            content: content.trim(),
        };
    });
}

/** Aggregate stats for the dashboard. */
export function readLibraryStats() {
    const entries = readLibraryEntries();
    const bySubdomain: Record<string, number> = {};
    for (const e of entries) {
        const key = e.subdomain ?? "general";
        bySubdomain[key] = (bySubdomain[key] ?? 0) + 1;
    }
    const recent = [...entries]
        .filter((e) => e.filedAt)
        .sort((a, b) => (b.filedAt! > a.filedAt! ? 1 : -1))
        .slice(0, 5);

    return { total: entries.length, bySubdomain, recent };
}
