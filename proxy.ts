import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PATHS = ["/ruminations"];

export function proxy(req: NextRequest) {
    // In local development the Cloudflare headers are never present.
    // Skip all checks so the full app is accessible without a tunnel.
    if (process.env.NODE_ENV === "development") {
        return NextResponse.next();
    }

    // --- Defense-in-depth: verify the request came through Cloudflare Access ---
    // Cloudflare injects this header after a valid Access session is established.
    // A missing header means the request bypassed the tunnel entirely.
    const cfJwt = req.headers.get("cf-access-jwt-assertion");
    if (!cfJwt) {
        return new NextResponse("Forbidden", { status: 403 });
    }

    // --- Owner-only route guard ---
    const pathname = req.nextUrl.pathname;
    const isProtected = PROTECTED_PATHS.some(
        (p) => pathname === p || pathname.startsWith(`${p}/`)
    );

    if (isProtected) {
        const userEmail = req.headers.get("cf-access-authenticated-user-email");
        const ownerEmail = process.env.OWNER_EMAIL;

        if (!ownerEmail) {
            // Fail closed: if OWNER_EMAIL is not configured, deny access.
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
