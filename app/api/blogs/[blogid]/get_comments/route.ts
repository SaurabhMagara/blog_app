import connectionToDatabase from "@/lib/db";
import { Blog } from "@/models/blog.model";
import { Comment } from "@/models/comment.model";
import { User } from "@/models/user.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// -------------- get comments ------------------------

export async function GET(req: NextRequest, context: { params: { blogid: string } }) {
    try {

        await connectionToDatabase();

        const {blogid} = context.params;

        if (!blogid) {
            return NextResponse.json({ message: "blogid is required." }, { status: 400 });
        }

        if (!isValidObjectId(blogid)) {
            return NextResponse.json({ message: "Invalid blogid." }, { status: 400 });
        }

        const existingBlog = await Blog.findById(blogid);

        if (!existingBlog) {
            return NextResponse.json({ message: "No blogs found with given id." }, { status: 400 });
        }

        // finding comments from comments schema
        const comments = await Comment.find({ blogId: blogid }) ?.
            populate({ path: "userId", select: "username" }).  // Get username from userId
            populate({ path: "blogId", select: "postedBy" }); // Get postedBy from blogId

        // if there is no commets returning empty array
        if (!comments || comments?.length <= 0) {
            return NextResponse.json({ message: "There are no comments", data: [] }, { status: 200 });
        }

        return NextResponse.json({ message: "Comments recieved.", data: comments }, { status: 200 });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ message: error?.message || "Something went wrong.", error }, { status: 500 });
    }
}