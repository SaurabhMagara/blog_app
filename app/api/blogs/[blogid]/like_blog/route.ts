import connectionToDatabase from "@/lib/db";
import { Blog } from "@/models/blog.model";
import { Like } from "@/models/likes.model";
import { User } from "@/models/user.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// -------------- get blog likes ------------------------

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
    console.log(error);
    return NextResponse.json(
      { message: error?.message || "Something went wrong.", error },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ blogid: string }> }
) {
  try {
    await connectionToDatabase();

    const { blogid } = await params;
    const { userid } = await req.json();

    if (!blogid) {
      return NextResponse.json({ message: "blogid is required." }, { status: 400 });
    }

    if (!userid) {
      return NextResponse.json({ message: "userid is required." }, { status: 400 });
    }

    if (!isValidObjectId(blogid) || !isValidObjectId(userid)) {
      return NextResponse.json({ message: "Invalid userid or blogid." }, { status: 400 });
    }

    const existingBlog = await Blog.findById(blogid);
    if (!existingBlog) {
      return NextResponse.json({ message: "No blog with given id." }, { status: 400 });
    }

    const existingUser = await User.findById(userid);
    if (!existingUser) {
      return NextResponse.json({ message: "No user with given id." }, { status: 400 });
    }

    const existingLike = await Like.findOne({ userid, blogid });
    if (existingLike) {
      return NextResponse.json({ message: "Blog already liked." }, { status: 400 });
    }

    const newLike = new Like({ userid, blogid });
    await newLike.save();

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogid,
      { $inc: { likes: 1 } },
      { new: true }
    );

    return NextResponse.json(
      { message: "Blog liked successfully.", data: updatedBlog },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: error?.message || "Something went wrong.", error },
      { status: 500 }
    );
  }
}
