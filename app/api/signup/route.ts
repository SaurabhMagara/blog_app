"use server"

import connectionToDatabase from "@/lib/db";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { Readable } from "stream";
import cloudinary from "@/lib/cloudinary";


// rehister user route or signup route

export default async function POST(req: NextRequest, res: NextResponse) {
    try {
        await connectionToDatabase();

        // const {email, password, username} = await req.json();
        const formData = await req.formData();

        const email = formData.get("email") as string;
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;
        const file = formData.get("image") as File;

        if (!email || !password || !username) {
            return NextResponse.json({ message: "All fields are required." }, { status: 401 });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return NextResponse.json({ message: "Email or username already in use!" }, { status: 401 });
        }

        const genSalt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, genSalt);

        // getting file 
        const buffer = Buffer.from(await file.arrayBuffer());
        const stream = Readable.from(buffer);

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

        // Now save the user with the correct profile_pic structure
        const user = new User({
            username,
            email,
            password: hashedPassword,
            profile_pic: {
                url: uploadedImage.url,
                public_id: uploadedImage.public_id
            }
        });

        const newUser = await user.save();

        return NextResponse.json({ message: "Registered Successfully", data: newUser }, { status: 201 });

    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ error: error.message || "Something went wrong." }, { status: 500 });
    }
}