"use server"

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"; // If using JWT

export default async function GET(request: NextRequest) {
    try {
        // Get token from cookies
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify token & decode user data (if using JWT)
        const decodedUser = jwt.verify(token, process.env.JWT_SECRET!) as { _id: string; username: string; email: string };

        // console.log(decodedUser);
        return NextResponse.json({ data: decodedUser });
    } catch (error) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}
