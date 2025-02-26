import connectionToDatabase from "@/lib/db";
import { Blog } from "@/models/blog.model";
import { Like } from "@/models/likes.model";
import { User } from "@/models/user.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, { params }: { params: { blogid: string } }) {
    try {
        await connectionToDatabase();

        const blogid = params.blogid;
        const { userid } = await req.json();

        if (!blogid) {
            return NextResponse.json({ message: "blogid is required." }, { status: 400 });
        }

        if (!userid) {
            return NextResponse.json({ message: "userid is required." }, { status: 400 });
        }

        if (!isValidObjectId(userid) || !isValidObjectId(blogid)) {
            return NextResponse.json({ message: "Invalid userid or blogid." }, { status: 400 });
        }

        const existingBlog = await Blog.findById(blogid);
        if (!existingBlog) {
            return NextResponse.json({ message: "No blog with given id" }, { status: 400 });
        }

        const existingUser = await User.findById(userid);
        if (!existingUser) {
            return NextResponse.json({ message: " No User with given id." }, { status: 400 });
        }

        const existingLike = await Like.findOne({ userid, blogid });

        if (!existingLike) {
            return NextResponse.json({ message: "You didnt liked this blog." }, { status: 400 });
        }

        const updateLike = await Like.findByIdAndDelete(existingLike._id);

        if (!updateLike) {
            return NextResponse.json({message : "Something went wrong while updateing Like."},{status :400});
        }

        const updatedBlog = await Blog.findByIdAndUpdate(blogid, {
            $inc: {
                likes: -1
            }
        },
            {
                new: true
            }
        );

        return NextResponse.json({ message: "Blog unliked successfully.", data: updatedBlog }, { status: 200 });
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ message: error?.message || "Something went wrong.", error }, { status: 500 });
    }
}