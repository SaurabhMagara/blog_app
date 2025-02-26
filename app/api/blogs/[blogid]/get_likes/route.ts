import connectionToDatabase from "@/lib/db";
import { Blog } from "@/models/blog.model";
import { Like } from "@/models/likes.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// -------------- get blogs likes--------------------

export async function GET(req: NextRequest, { params }: { params: { blogid: string } }) {
    try {
        await connectionToDatabase();

        const blogid = params.blogid;

        if(!blogid || !isValidObjectId(blogid)){
            return NextResponse.json({message : "Invalid blogid."},{status:400});
        }

        const existingBlog = await Blog.findById(blogid);

        if(!existingBlog){
            return NextResponse.json({message : "No blog with given id."}, {status : 400});
        }

        const Likes = await Like.find({blogid});

        if(!Likes || Likes?.length <=0){
            return NextResponse.json({message : "There no likes.", data : []}, {status : 200});
        }

        return NextResponse.json({message : "Likes recieved successfully.", data : Likes},{status : 200});

    } catch (error : any) {
        console.log(error);
        return NextResponse.json({message : error?.message || "Something went wrong", error},{status : 500});
    }
}