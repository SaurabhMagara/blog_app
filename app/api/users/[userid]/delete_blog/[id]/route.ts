"use server"

import connectionToDatabase from "@/lib/db";
import { Blog } from "@/models/blog.model";
import { User } from "@/models/user.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// delete blog route

export async function DELETE(req: NextRequest, { params }: { params: {userid : string, id: string } }) {
    try {
        await connectionToDatabase();
        // take userid and id : blogid from params
        const { userid, id } = params;

        // check userid and blog id is given
        if (!id) {
            return NextResponse.json({ message: "id is required." }, { status: 400 });
        }

        if(!userid){
            return NextResponse.json({message : "Userid is required."}, {status : 400});
        }

        if(!isValidObjectId(userid) || !isValidObjectId(id)){
            return NextResponse.json({message : "Invalid userid or blogid."}, {status : 400});
        }

        //check if user with given id exists or not
        const existingUserWithBlogId = await User.find({_id : userid, blogs : id});

        if (!existingUserWithBlogId || existingUserWithBlogId.length <=0){
            return NextResponse.json({message : "Invalid userid or given blog id does not exists."}, {status : 400});
        }

        //deleting 
        const deleteResponse = await Blog.deleteOne({ _id: id });

        if (!deleteResponse) {
            return NextResponse.json({ message: "Something went wrong while deleting response", error: deleteResponse }, { status: 500 });
        }

        // delete blog from users blogs array

        const updatedUser = await User.findByIdAndUpdate(
            userid,
            {
                $pull : {blogs : id}, // pull operator deletes given id from blogs array
                new : true
            }
            
        );


        return NextResponse.json({ message: "Blog deleted successfully", data: [deleteResponse, updatedUser] }, { status: 200 })
    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ message: error.message || "Something went wrong", error: error }, { status: 500 })
    }
}