import connectionToDatabase from "@/lib/db";
import { User } from "@/models/user.model";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { Readable } from "stream";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest, { params }: { params: Promise<{ [key: string]: string }> }) {
    try {
        await connectionToDatabase();

        const formData = await req.formData();
        const email = formData.get("email") as string;
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;
        const file = formData.get("image") as File;

        if (!email || !password || !username) {
            return new Response(JSON.stringify({ message: "All fields are required." }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return new Response(JSON.stringify({ message: "Email or username already in use!" }), {
                status: 409,
                headers: { "Content-Type": "application/json" },
            });
        }

        const genSalt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, genSalt);

        let buffer;
        let stream: Readable;
        let uploadPromise;
        let uploadedImage;

        if (file) {
            buffer = Buffer.from(await file.arrayBuffer());
            stream = Readable.from(buffer);

            uploadPromise = new Promise<{ url: string; public_id: string }>((resolve, reject) => {
                const cloudinaryUpload = cloudinary.uploader.upload_stream(
                    { folder: "nextjs_uploads" },
                    (error, result) => {
                        if (error || !result) return reject(error);
                        resolve({ url: result.secure_url, public_id: result.public_id });
                    }
                );
                stream.pipe(cloudinaryUpload);
            });

            uploadedImage = await uploadPromise;

            if (!uploadedImage) {
                return new Response(JSON.stringify({ message: "Upload failed" }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                });
            }

        }
        
        const user = new User({
            username,
            email,
            password: hashedPassword,
            profile_pic: {
                url: uploadedImage?.url,
                public_id: uploadedImage?.public_id
            }
        });

        const newUser = await user.save();

        return new Response(JSON.stringify({ message: "Registered Successfully", data: newUser }), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error: any) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message || "Something went wrong." }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}
