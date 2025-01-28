import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    try {
        // Extract the token from cookies
        const token = request.cookies.get("token")?.value;

        console.log("Token from cookies:", token); // Debugging

        // If no token is found, respond with 401 Unauthorized
        if (!token) {
            return NextResponse.json(
                { message: "User unauthenticated" },
                { status: 401 }
            );
        }

        // If the token exists, allow the request to proceed
        return NextResponse.next();
    } catch (error: any) {
        console.error("Middleware error:", error.message);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// Apply the middleware to specific routes
export const config = {
    matcher: [
        "/api/v1/logout",
        "/api/v1/users/:userid",
    ],
};
