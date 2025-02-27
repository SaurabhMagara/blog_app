import connectionToDatabase from "@/lib/db";
import { Blog } from "@/models/blog.model";
import { Like } from "@/models/likes.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/user.model"; // Ensure User model is imported

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ blogid: string }> }
) {
  try {
    await connectionToDatabase();

    const { blogid } = await params;

    if (!blogid || !isValidObjectId(blogid)) {
      return NextResponse.json({ message: "Invalid blogid." }, { status: 400 });
    }

    const existingBlog = await Blog.findById(blogid);

    if (!existingBlog) {
      return NextResponse.json({ message: "No blog with given id." }, { status: 400 });
    }

    const likes = await Like.find({ blogid });

    if (!likes || likes.length === 0) {
      return NextResponse.json({ message: "There are no likes.", data: [] }, { status: 200 });
    }

    return NextResponse.json({ message: "Likes received successfully.", data: likes }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message || "Something went wrong", error }, { status: 500 });
  }
}
