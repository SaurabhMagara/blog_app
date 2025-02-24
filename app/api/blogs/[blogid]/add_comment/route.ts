import connectionToDatabase from "@/lib/db";
import { Blog } from "@/models/blog.model";
import { User } from "@/models/user.model";
import { Comment } from "@/models/comment.model";
import mongoose, { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// ----------------- post comment ---------------------

export async function POST(req : NextRequest, {params} : {params : {blogid : string}}){
    try {
        // conneting to db
        await connectionToDatabase();

        const blogid = params.blogid;
        const { userid, content } = await req.json();

        if(!blogid){
            return NextResponse.json({message : "blog id is required,"}, {status : 500});
        }

        if(!isValidObjectId(blogid)){
            return NextResponse.json({message : "Invalid blogid."}, {status  :400});
        }

        if(!userid){
            return NextResponse.json({message : "userid is required."},{status  :400});
        }

        if(!isValidObjectId(userid)){
            return NextResponse.json({message : "invalid userid."}, {status  :400});
        }

        if(!content || content?.trim() === ""){
            return NextResponse.json({message : "content is required."}, {status  :400});
        }

        const existingBlog = await Blog.findById(blogid);

        if(!existingBlog){
            return NextResponse.json({message: "No blogs with given id."}, {status: 400});
        }

        const existingUser = await User.findById(userid);

        if(!existingUser){
            return NextResponse.json({message : "user with given id dosent exists."}, {status : 400});
        }

        const comment = new Comment({
            userId : userid,
            blogId : blogid,
            content
        });

        if(!comment){
            return NextResponse.json({message : "Something went wrong while creating comment."},{status : 500});
        }

        await comment.save();

        await Blog.findByIdAndUpdate({_id : blogid},{$inc : {comments : 1}})

        return NextResponse.json({message : "Comment added successfully.", data  :comment}, {status :200});

    } catch (error: any) {
        console.log(error);
        return NextResponse.json({message : error.message || "Something went wrong.", error}, {status : 500});
    }
}