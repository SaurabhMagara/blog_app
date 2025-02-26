"use server"

import connectionToDatabase from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import { Blog } from "@/models/blog.model";
import { User } from "@/models/user.model";
import mongoose, { isValidObjectId, Schema, Types, Document, Model } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";

// ------------- create blog route----------------

export async function POST(req: Request, context: { params: { userid: string } }) {
    try {

        await connectionToDatabase();

        // getting formdata because we also get image
        const formData = await req.formData();

        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const file = formData.get("image") as File;

        const {userid} = context.params;

        if (!userid) {
            return NextResponse.json({ message: "userid is reuired." }, { status: 400 });
        }

        if (!isValidObjectId(userid)) {
            return NextResponse.json({ message: "Invalid userid" }, { status: 400 });
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
        // uploading profile pic in cloudinary
        const uploadPromise = new Promise<{ url: string; public_id: string }>((resolve, reject) => {
            const cloudinaryUpload = cloudinary.uploader.upload_stream(
                { folder: "nextjs_uploads" },
                (error, result) => {
                    if (error || !result) return reject(error);
                    resolve({ url: result.secure_url, public_id: result.public_id }); // Get both URL & public_id
                }
            );
            stream.pipe(cloudinaryUpload);
        });

        const uploadedImage = await uploadPromise;

        if (!uploadedImage) {
            return NextResponse.json({ message: "Upload failed" }, { status: 500 });
        }

        // creating new blog
        const blog = new Blog({
            title,
            content,
            image: {
                url: uploadedImage.url,
                public_id: uploadedImage.public_id
            },
            postedBy: userid
        });
        await blog.save();

        //if there is no blogs on user then create empty array
        if (!user.blogs) {
            user.blogs = [];
        }

        // pushing blog id in user array for upadting users blogs
        user.blogs.push(blog._id as mongoose.Types.ObjectId);
        await user.save();

        return NextResponse.json({ message: "blog created", data: blog }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Something went wrong while creating blog.", error }, { status: 500 });
    }
}