import connectionToDatabase from "@/lib/db";
import { Blog } from "@/models/blog.model";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectionToDatabase();

        const blogs = await Blog.find().populate("postedBy", "username");

        if (!blogs) {
            return NextResponse.json({ message: "Blogs are empty." }, { status: 200 });
        }

        return NextResponse.json({ message: "Blogs recieved", data: blogs }, { status: 200 });

    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
    }
}