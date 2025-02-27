import connectionToDatabase from "@/lib/db";
import { Blog } from "@/models/blog.model";
import { Comment } from "@/models/comment.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/user.model"; // Ensure User model is imported

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectionToDatabase();

    const { id } = await params;

    if (!id || !isValidObjectId(id)) {
      return NextResponse.json({ message: "Invalid comment id." }, { status: 400 });
    }

    const existingComment = await Comment.findById(id);

    if (!existingComment) {
      return NextResponse.json({ message: "Comment not found." }, { status: 404 });
    }

    await Comment.findByIdAndDelete(existingComment._id);

    const updatedBlog = await Blog.findByIdAndUpdate(
      existingComment.blogId,
      { $inc: { comments: -1 } },
      { new: true }
    );

    return NextResponse.json(
      { message: "Comment deleted successfully.", data: updatedBlog },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: error?.message || "Something went wrong while deleting comment.", error },
      { status: 500 }
    );
  }
}
