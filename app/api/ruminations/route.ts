import { NextResponse } from "next/server";
import { readRuminations } from "@/lib/libraryReader";

export const revalidate = 60;

export async function GET() {
    try {
        const ruminations = readRuminations();
        return NextResponse.json(ruminations);
    } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
