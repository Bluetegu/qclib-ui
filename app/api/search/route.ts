import { NextRequest, NextResponse } from "next/server";
import Fuse, { type IFuseOptions } from "fuse.js";
import { readLibraryEntries } from "@/lib/libraryReader";
import type { LibraryEntry } from "@/lib/libraryReader";

export const revalidate = 60;

const FUSE_OPTIONS: IFuseOptions<LibraryEntry> = {
    keys: [
        { name: "title", weight: 0.4 },
        { name: "summary", weight: 0.25 },
        { name: "authors", weight: 0.2 },
        { name: "tags", weight: 0.15 },
    ],
    threshold: 0.35,
    includeScore: true,
};

export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get("q")?.trim();
    if (!q) {
        return NextResponse.json({ error: "Missing query parameter 'q'" }, { status: 400 });
    }

    try {
        const entries = readLibraryEntries();
        const fuse = new Fuse(entries, FUSE_OPTIONS);
        const results = fuse.search(q).map((r) => ({ ...r.item, score: r.score }));
        return NextResponse.json(results);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
