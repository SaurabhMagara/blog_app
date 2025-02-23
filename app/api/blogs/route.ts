"use server"

import connectionToDatabase from "@/lib/db";
import { Blog } from "@/models/blog.model";
import { NextResponse } from "next/server";

// get all blogs route

export async function GET() {
    try {
        await connectionToDatabase();

        const blogs = await Blog.find()?.populate("postedBy", "username");

        if (!blogs || blogs.length <= 0 ) {
            return NextResponse.json({ message: "No blogs yet." , data : []}, { status: 200 });
        }

        return NextResponse.json({ message: "Blogs recieved", data: blogs }, { status: 200 });

    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
    }
}