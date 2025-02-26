"use server";

import connectionToDatabase from "@/lib/db";
import { Blog } from "@/models/blog.model";
import { Comment } from "@/models/comment.model";
import { Like } from "@/models/likes.model";
import { User } from "@/models/user.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";


// delete blog route
export default async function DELETE(req: NextRequest, { params }: { params: { userid: string; id: string } }) {
    try {
        await connectionToDatabase();

        // Extract userId and blogId from params
        const { userid, id } = params;

        // Validate required fields
        if (!id) return NextResponse.json({ message: "Blog ID is required." }, { status: 400 });
        if (!userid) return NextResponse.json({ message: "User ID is required." }, { status: 400 });

        // Validate ObjectId format
        if (!isValidObjectId(userid) || !isValidObjectId(id)) {
            return NextResponse.json({ message: "Invalid User ID or Blog ID." }, { status: 400 });
        }

        // Check if the user owns the blog
        const existingUserWithBlogId = await User.findOne({ _id: userid, blogs: id });

        if (!existingUserWithBlogId) {
            return NextResponse.json({ message: "Invalid User ID or Blog ID does not exist." }, { status: 400 });
        }

        // Fetch the blog to get the image public_id from Cloudinary
        const blog = await Blog.findById(id);
        if (!blog) {
            return NextResponse.json({ message: "Blog not found." }, { status: 404 });
        }

        if (blog.image && blog.image?.public_id) {
            await cloudinary.uploader.destroy(blog.image.public_id);
        }

        // Perform deletions concurrently
        const [deleteResponse, updatedUser, deletedLikes, deletedComments] = await Promise.all(
            [
                Blog.findByIdAndDelete(id), // Delete the blog
                User.findByIdAndUpdate(userid, { $pull: { blogs: id } }, { new: true }).select("-password"), // Remove blog ID from user
                Like.deleteMany({ blogid: id }), // Delete likes related to the blog
                Comment.deleteMany({ blogId: id }) // Delete comments related to the blog (Fixed `blogId`)
            ]
        );

        // Ensure blog deletion was successful
        if (!deleteResponse) {
            return NextResponse.json({ message: "Failed to delete the blog.", error: deleteResponse }, { status: 500 });
        }

        return NextResponse.json({
            message: "Blog deleted successfully",
            data: { deleteResponse, updatedUser, deletedLikes, deletedComments }
        }, { status: 200 });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: error.message || "Something went wrong", error }, { status: 500 });
    }
}