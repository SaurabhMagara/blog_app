import connectionToDatabase from "@/lib/db";
import { Blog } from "@/models/blog.model";
import { Comment } from "@/models/comment.model";
import { User } from "@/models/user.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(req: NextRequest, { params }: { params: { id:string } }) {
    try {

        await connectionToDatabase();

        const id = params.id;

        if(!id || !isValidObjectId(id)){
            return NextResponse.json({message : "Invalid comment id."},{status :400});
        }

        const existingComment = await Comment.findById(id);

        if (!existingComment) {
            return NextResponse.json({ message: "You dont have any comments in this blog.", data: [] }, { status: 200 });
        }

        await Comment.findByIdAndDelete(existingComment._id);

        const updatedBlog = await Blog.findByIdAndUpdate(existingComment.blogId, {
            $inc: {
                comments: -1
            }
        },
            {
                new: true
            }
        );

        NextResponse.json({message : "Comment deleted successfully.", data : updatedBlog},{status : 200});

    } catch (error: any) {
        console.log(error);
        return NextResponse.json({message : error?.message || "Something went wrong while deleting comment.", error},{status:500});
    }
}