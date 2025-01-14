import connectionToDatabase from "@/lib/db";
import { Blog } from "@/models/blog.model";
import { User } from "@/models/user.model";
import { Schema } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Define the expected body structure

interface BlogRequestBody {
    title: string;
    content: string;
    postedBy: Schema.Types.ObjectId; // Ensure it matches the type in your Mongoose model
  }

export async function POST(req : NextRequest){
    try {

        await connectionToDatabase();

        const {title, content, postedBy} = await req.json() as BlogRequestBody;

        if(!title || !content || !postedBy){
            return NextResponse.json({message : "All fields are required"}, {status : 401});
        }

        const user = await User.findById({_id : postedBy});

        if(!user){
            return NextResponse.json({message : "User not found"}, {status : 400});
        }

        const blog = new Blog({title, content, postedBy});

        // reaming code here 
    } catch (error : any) {
        
    }
}