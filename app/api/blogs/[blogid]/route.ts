import connectionToDatabase from "@/lib/db";
import { Blog } from "@/models/blog.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// --------------- get blog by id route ------------------------

export async function GET(req: Request, { params }: { params: { blogid: string } }) {
    try {

        // connecting to db
        await connectionToDatabase();

        // getting blog id from params
        const blogid = params.blogid;

        // checking blogid is given
        if (!blogid) {
            return NextResponse.json({ message: "Blog id is required to get specific blog" }, { status: 400 });
        }

        // checking blogid is valid mongoid
        if (!isValidObjectId(blogid)) {
            return NextResponse.json({ message: "Invalid ObjectId." }, { status: 400 });
        }

        // checking if blog with given id
        const existingBlog = await Blog.findById(blogid);

        // if blog with given id dosent exists gives error
        if (!existingBlog) {
            return NextResponse.json({ message: "No blog with given id." }, { status: 400 });
        }

        // if everything is right returning response
        return NextResponse.json({ message: "blog recieved successfully", data: existingBlog }, { status: 200 });

    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ message: error.message || `Something went wrong while fetching blog with given id`, error }, { status: 500 })
    }
}