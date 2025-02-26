import connectionToDatabase from "@/lib/db";
import { Blog } from "@/models/blog.model";
import { Like } from "@/models/likes.model";
import { User } from "@/models/user.model";
import mongoose, { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// ------------- like blog route---------------

export async function POST(req : NextRequest, {params} : {params : {blogid: string}}){
    try {

        // connecting to db
        await connectionToDatabase();

        // getting blogid from params
        const blogid = params.blogid;

        // getting userid from body
        const {userid} = await req.json() ;

        // checking blogid is given or not
        if(!blogid){
            return NextResponse.json({message : "blogid is required."}, {status : 400});
        }

        // checking blog id is valid mongo id
        if(!isValidObjectId(blogid)){
            return NextResponse.json({message : "Invalid blogid."}, {status  :400});
        }

        // checking if userid is here
        if(!userid){
            return NextResponse.json({message : "userid is required."}, {status  :500});
        }

        // checking user id is valid userid
        if(!isValidObjectId(userid)){
            return NextResponse.json({message : "Invalid userid."}, {status : 400});
        }

        // finding blog from given id
        const blog = await Blog.findById(blogid);

        // checking if blog is fetched
        if(!blog){
            return NextResponse.json({message : "No blog with given id."},{status : 400});
        }

        // fethcing user by given userid
        const user = await User.findById(userid);

        //checking if user exists with given id
        if(!user){
            return NextResponse.json({message : "User with given id is not found."}, {status  : 400})
        }

        // checking is its already liked
        const existingLike = await Like.findOne({ userid, blogid });
        if (existingLike) {
            return NextResponse.json({ message: "You have already liked this blog." }, { status: 400 });
        }

        // saving like if user and blog with given id is found
        const like = new Like({
            userid,
            blogid
        });

        // saving like model
        await like.save();

        // checking like created or not
        if (!like) {
            return NextResponse.json({ message: "Something went wrong while creating like." }, { status: 500 });
        }
        
        await Blog.findByIdAndUpdate({_id : blogid}, {$inc : {likes : 1}},{new : true});

        //returning response
        return NextResponse.json({message : "Blog liked", data : like},{status : 200});
    } catch (error : any) {
        console.log(error);
        return NextResponse.json({message : error.message ||"Something went wrong.", error}, {status : 500});
    }
}