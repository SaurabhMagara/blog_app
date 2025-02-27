"use server"

import connectionToDatabase from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import { Blog } from "@/models/blog.model";
import { User } from "@/models/user.model";
import mongoose, { isValidObjectId } from "mongoose";
import { NextRequest } from "next/server";
import { Readable } from "stream";

// ------------- create blog route----------------

export async function POST(req: NextRequest, { params }: { params: Promise<{ userid: string }> }) {
    try {
        // Connect to the database
        await connectionToDatabase();

        // Parse the incoming form data
        const formData = await req.formData();
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const file = formData.get("image") as File;

        // Await the params promise to get the userid
        const { userid } = await params;

        // Validate the userid
        if (!userid) {
            return new Response(JSON.stringify({ message: "userid is required." }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        if (!isValidObjectId(userid)) {
            return new Response(JSON.stringify({ message: "Invalid userid" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Ensure all required fields are present
        if (!title || !content || !file) {
            return new Response(JSON.stringify({ message: "All fields are required" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Find the user by ID
        const user = await User.findById(userid);

        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), {
                status: 404,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Convert the file to a buffer and create a readable stream
        const buffer = Buffer.from(await file.arrayBuffer());
        const stream = Readable.from(buffer);

        // Upload the image to Cloudinary
        const uploadPromise = new Promise<{ url: string; public_id: string }>((resolve, reject) => {
            const cloudinaryUpload = cloudinary.uploader.upload_stream(
                { folder: "nextjs_uploads" },
                (error, result) => {
                    if (error || !result) return reject(error);
                    resolve({ url: result.secure_url, public_id: result.public_id });
                }
            );
            stream.pipe(cloudinaryUpload);
        });

        const uploadedImage = await uploadPromise;

        if (!uploadedImage) {
            return new Response(JSON.stringify({ message: "Upload failed" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        // Create a new blog post
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

        // Initialize the user's blogs array if it doesn't exist
        if (!user.blogs) {
            user.blogs = [];
        }

        // Add the new blog's ID to the user's blogs array
        user.blogs.push(blog._id as mongoose.Types.ObjectId);
        await user.save();

        // Return a success response with the created blog data
        return new Response(JSON.stringify({ message: "Blog created", data: blog }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error: any) {
        // Log the error and return a server error response
        console.error(error);
        return new Response(JSON.stringify({ message: error.message || "Something went wrong while creating blog." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
