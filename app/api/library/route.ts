import { NextResponse } from "next/server";
import { readLibraryEntries } from "@/lib/libraryReader";

export const revalidate = 60; // ISR: refresh at most every 60 seconds

export async function GET() {
    try {
        const entries = readLibraryEntries();
        return NextResponse.json(entries);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
