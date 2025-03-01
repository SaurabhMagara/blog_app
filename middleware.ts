import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {jwtVerify} from "jose";

export async function middleware(request: NextRequest) {
    try {
        // Extract the token from cookies
        const token = request.cookies.get("token")?.value;

        // Debugging
        console.log("Token from cookies:", token);

        // If no token is found, respond with 401 Unauthorized
        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Verify the token
        const secret = new TextEncoder().encode(process.env.JWT_SECRET); // Convert the secret to Uint8Array
        const { payload } = await jwtVerify(token, secret); // Decode and verify the token
        console.log("Decoded token:", payload);

        // If the token is valid, proceed with the request
        return NextResponse.next();
    } catch (error: any) {
        console.error("Middleware error:", error);

        // Handle token verification errors
        if (error.name === "JsonWebTokenError") {
            return NextResponse.json(
                { message: "Invalid token." },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { message: "Internal server error.", error : error },
            { status: 500 }
        );
    }
}

// Apply the middleware to specific routes
export const config = {
    matcher: [
        "/api/logout",
        "/api/users/:userid*",
        "/api/blogs",
        "/api/blogs/:blogid*"
    ],
};
