import { Blog } from "@/models/blog.model";
import { User } from "@/models/user.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

interface Params {
    params : Promise<{userid : string}>
}

export async function GET (req : NextRequest, params : Params){
    try {
        const {userid} = await params.params;

        if(!userid || !isValidObjectId(userid)){
            return NextResponse.json({message : "Invalid userid."},{status : 400});
        }

        const existingUser = await User.findById(userid);

        if(!existingUser){
            return NextResponse.json({message : "Invalid userid : user not found."}, {status : 404});
        }

        const blogs = await Blog.find({postedBy : userid});

        if(!blogs){
            return NextResponse.json({message : "No blogs yet.", data : blogs}, {status :200});
        }

        return NextResponse.json({message : "Blogs recieved.", data : blogs}, {status : 200});
    } catch (error : any) {
        console.log(error);
        return NextResponse.json({message : error?.message || "Something went wrong.", error},{status :500});
    }
}