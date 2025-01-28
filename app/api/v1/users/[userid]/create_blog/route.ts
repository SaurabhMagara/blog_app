"use server"

import connectionToDatabase from "@/lib/db";
import { Blog } from "@/models/blog.model";
import { User } from "@/models/user.model";
import { isValidObjectId, Schema } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// create blog route

interface BlogRequestBody {
    title: string;
    content: string;
}

export async function POST(req: NextRequest, {params} : {params : {userid : string}}) {
    try {

        await connectionToDatabase();

        const { title, content } = await req.json() as BlogRequestBody;
        const {userid} = params;

        if(!userid){
            return NextResponse.json({message : "userid is reuired."}, {status : 400});
        }

        if(!isValidObjectId){
            return NextResponse.json({message : "Invalid userid"}, {status : 400});
        }

        if (!title || !content || !userid) {
            return NextResponse.json({ message: "All fields are required" }, { status: 401 });
        }

        const user = await User.findById({ _id: userid });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 400 });
        }

        const blog = new Blog({ title, content, postedBy : userid });
        await blog.save();

        //if there is no blogs on user then create empty array
        if (!user.blogs) {
            user.blogs = [];
        }

        user.blogs.push(blog._id as Schema.Types.ObjectId);
        await user.save();

        return NextResponse.json({ message: "blog created", data: blog }, { status: 200 });


    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
    }
}