"use server"

import connectionToDatabase from "@/lib/db";
import { Blog } from "@/models/blog.model";
import { User } from "@/models/user.model";
import { isValidObjectId, Schema } from "mongoose";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

// create blog route

interface BlogRequestBody {
    title: string;
    content: string;
}

// multer for handling photo
const upload = multer({ storage: multer.memoryStorage() });

export async function POST(req: NextRequest, {params} : {params : {userid : string}}) {
    try {

        await connectionToDatabase();

        // getting formdata because we also get image
        const formData = await req.formData();

        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const file = formData.get("image") as File;

        const {userid} = params;

        upload.single("image")

        if(!userid){
            return NextResponse.json({message : "userid is reuired."}, {status : 400});
        }

        if(!isValidObjectId(userid)){
            return NextResponse.json({message : "Invalid userid"}, {status : 400});
        }

        if (!title || !content || !file) {
            return NextResponse.json({ message: "All fields are required" }, { status: 401 });
        }

        const user = await User.findById({ _id: userid });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 400 });
        }

        // getting file 
        const buffer = Buffer.from(await file.arrayBuffer());
        const stream = Readable.from(buffer);

        // uploading image in cloudinary
        const uploadPromise = new Promise<string>((resolve, reject) => {
            const cloudinaryUpload = cloudinary.uploader.upload_stream(
                { folder: "nextjs_uploads" },
                (error, result) => {
                    if (error || !result) return reject(error);
                    resolve(result.secure_url);
                }
            );
            stream.pipe(cloudinaryUpload);
        });

        if(!uploadPromise){
            return NextResponse.json({message : "uplaod failed "}, {status : 500});
        }

        // getting image url from cludinary
        const imageUrl = await uploadPromise;

        if(!imageUrl){
            return NextResponse.json({message : "Can not get image url from cloudinary."},{status : 500});
        }

        // creating new blog
        const blog = new Blog({ title, content, image : imageUrl , postedBy : userid });
        await blog.save();

        //if there is no blogs on user then create empty array
        if (!user.blogs) {
            user.blogs = [];
        }

        // pushing blog id in user array for upadting users blogs
        user.blogs.push(blog._id as Schema.Types.ObjectId);
        await user.save();

        return NextResponse.json({ message: "blog created", data: blog }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Something went wrong while creating blog." }, { status: 500 });
    }
}