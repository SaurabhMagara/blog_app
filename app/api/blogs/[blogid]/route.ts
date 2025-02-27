import connectionToDatabase from "@/lib/db";
import { Blog } from "@/models/blog.model";
import { Like } from "@/models/likes.model";
import { User } from "@/models/user.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ blogid: string }> }
) {
  try {
    // Await the params to get the blogid
    const { blogid } = await context.params;

    // connecting to db
    await connectionToDatabase();

    // getting userid from body
    const { userid } = await req.json();

    // checking blogid is given
    if (!blogid) {
      return NextResponse.json(
        { message: "blogid is required." },
        { status: 400 }
      );
    }

    // checking userid is given
    if (!userid) {
      return NextResponse.json(
        { message: "userid is required." },
        { status: 400 }
      );
    }

    // checking if blogid and userid are valid ObjectIds
    if (!isValidObjectId(blogid) || !isValidObjectId(userid)) {
      return NextResponse.json(
        { message: "Invalid userid or blogid." },
        { status: 400 }
      );
    }

    // finding blog by id
    const existingBlog = await Blog.findById(blogid);
    if (!existingBlog) {
      return NextResponse.json(
        { message: "No blog with given id." },
        { status: 400 }
      );
    }

    // finding user by id
    const existingUser = await User.findById(userid);
    if (!existingUser) {
      return NextResponse.json(
        { message: "No user with given id." },
        { status: 400 }
      );
    }

    // finding existing like
    const existingLike = await Like.findOne({ userid, blogid });
    if (!existingLike) {
      return NextResponse.json(
        { message: "You didn't like this blog." },
        { status: 400 }
      );
    }

    // deleting the like
    const deletedLike = await Like.findByIdAndDelete(existingLike._id);
    if (!deletedLike) {
      return NextResponse.json(
        { message: "Something went wrong while updating Like." },
        { status: 400 }
      );
    }

    // decrementing the like count in the blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogid,
      { $inc: { likes: -1 } },
      { new: true }
    );

    return NextResponse.json(
      { message: "Blog unliked successfully.", data: updatedBlog },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: error?.message || "Something went wrong.", error },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ blogid: string }> }
) {
  try {
    // Await the params to get the blogid
    const { blogid } = await context.params;

    // connecting to db
    await connectionToDatabase();

    // checking blogid is given
    if (!blogid) {
      return NextResponse.json(
        { message: "blogid is required." },
        { status: 400 }
      );
    }

    // checking if blogid is valid ObjectId
    if (!isValidObjectId(blogid)) {
      return NextResponse.json(
        { message: "Invalid blogid." },
        { status: 400 }
      );
    }

    // finding blog by id and populating the postedBy field
    const blog = await Blog.findById(blogid).populate("postedBy", "username");
    
    if (!blog) {
      return NextResponse.json(
        { message: "No blog found with given id." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Blog fetched successfully.", data: blog },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: error?.message || "Something went wrong.", error },
      { status: 500 }
    );
  }
}
