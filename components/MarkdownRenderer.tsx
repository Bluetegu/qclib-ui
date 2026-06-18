import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface MarkdownRendererProps {
    content: string;
    wikiLinks?: Record<string, string>;
}

function normalizeWikiKey(value: string): string {
    return value.trim().replace(/^\//, "").replace(/\.md$/i, "");
}

function withLeadingSlash(value: string): string {
    return value.startsWith("/") ? value : `/${value}`;
}

function wikilinksToMarkdown(content: string, wikiLinks?: Record<string, string>): string {
    if (!wikiLinks) return content;

    return content.replace(/\[\[([^\]\n]+)\]\]/g, (full, inner: string) => {
        const [rawTarget, rawLabel] = inner.split("|");
        const target = normalizeWikiKey(rawTarget ?? "");
        if (!target) return full;

        const href = wikiLinks[target] ?? wikiLinks[withLeadingSlash(target)];
        if (!href) return full;

        const label = (rawLabel ?? target).trim();
        return `[${label}](${href})`;
    });
}

export function MarkdownRenderer({ content, wikiLinks }: MarkdownRendererProps) {
    const renderedContent = wikilinksToMarkdown(content, wikiLinks);

    return (
        <div className="prose prose-neutral max-w-none prose-headings:font-semibold prose-a:text-indigo-600 prose-code:bg-neutral-100 prose-code:px-1 prose-code:rounded prose-pre:bg-neutral-900">
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
            >
                {renderedContent}
            </ReactMarkdown>
        </div>
    );
}
