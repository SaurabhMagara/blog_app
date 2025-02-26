"use server"

import connectionToDatabase from "@/lib/db";
import { Blog } from "@/models/blog.model";
import { User } from "@/models/user.model"; // Ensure User model is imported
import { NextResponse } from "next/server";

// get all blogs route

export default async function GET() {
    try {
        // connecting db
        await connectionToDatabase();

        // getting blogs from db
        const blogs = await Blog.find()?.populate("postedBy","username");

        // if blogs array is empty give empty array
        if (!blogs || blogs.length <= 0 ) {
            return NextResponse.json({ message: "No blogs yet." , data : []}, { status: 200 });
        }

        // if there is blogs return response
        return NextResponse.json({ message: "Blogs recieved", data: blogs }, { status: 200 });

    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ message: error.message || "Something went wrong", error }, { status: 500 });
    }
}