import connectionToDatabase from "@/lib/db";
import { Blog } from "@/models/blog.model";
import { User } from "@/models/user.model";
import { Comment } from "@/models/comment.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ blogid: string }> }
) {
  try {
    // Await the params as they are now a Promise
    const { blogid } = await params;
    const body = await request.json();
    const { userid, content } = body;

    if (!blogid) {
      return NextResponse.json({ message: "Blog ID is required." }, { status: 400 });
    }

    if (!isValidObjectId(blogid)) {
      return NextResponse.json({ message: "Invalid blog ID." }, { status: 400 });
    }

    if (!userid) {
      return NextResponse.json({ message: "User ID is required." }, { status: 400 });
    }

    if (!isValidObjectId(userid)) {
      return NextResponse.json({ message: "Invalid user ID." }, { status: 400 });
    }

    if (!content || content.trim() === "") {
      return NextResponse.json({ message: "Content is required." }, { status: 400 });
    }

    const existingBlog = await Blog.findById(blogid);
    if (!existingBlog) {
      return NextResponse.json({ message: "No blog found with the given ID." }, { status: 404 });
    }

    const existingUser = await User.findById(userid);
    if (!existingUser) {
      return NextResponse.json({ message: "User with the given ID doesn't exist." }, { status: 404 });
    }

    const comment = new Comment({
      userId: userid,
      blogId: blogid,
      content,
    });

    await comment.save();
    await Blog.findByIdAndUpdate(blogid, { $inc: { comments: 1 } }, { new: true });

    return NextResponse.json({ message: "Comment added successfully.", data: comment }, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message || "Something went wrong.", error }, { status: 500 });
  }
}
