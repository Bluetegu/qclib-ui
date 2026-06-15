import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/ruminations"];

export function proxy(req: NextRequest) {
    // In local development the Cloudflare headers are never present.
    // Skip all checks so the full app is accessible without a tunnel.
    if (process.env.NODE_ENV === "development") {
        return NextResponse.next();
    }

    // --- Owner-only route guard ---
    // All other routes are publicly accessible.
    const pathname = req.nextUrl.pathname;
    const isProtected = PROTECTED_PATHS.some(
        (p) => pathname === p || pathname.startsWith(`${p}/`)
    );

    if (isProtected) {
        // Cloudflare Access is scoped to /ruminations* in the Zero Trust dashboard,
        // so this header is only present on requests that passed the Access gate.
        const cfJwt = req.headers.get("cf-access-jwt-assertion");
        if (!cfJwt) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const userEmail = req.headers.get("cf-access-authenticated-user-email");
        const ownerEmail = process.env.OWNER_EMAIL;

        if (!ownerEmail) {
            console.error("OWNER_EMAIL env var is not set — denying access to protected route.");
            return new NextResponse("Forbidden", { status: 403 });
        }

        if (userEmail?.toLowerCase() !== ownerEmail.toLowerCase()) {
            return new NextResponse("Forbidden", { status: 403 });
        }
    }

    return NextResponse.next();
}

export const config = {
    // Run on all routes except Next.js internals and static assets.
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
