"use server";

import cloudinary from "@/lib/cloudinary";
import { User } from "@/models/user.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { uploadImageToCloudinary } from "@/lib/uploadImageToCloudinary";

interface ContextType {
    params: Promise<{ userid: string }>;
}

export async function POST(req: NextRequest, context : ContextType ) {
    try {
        const { userid } = await context.params;

        if (!isValidObjectId(userid)) {
            return NextResponse.json({ message: "Invalid userid." }, { status: 400 });
        }

        const existingUser = await User.findById(userid);
        if (!existingUser) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }

        const fileData = await req.formData();
        const email = (fileData.get("email") as string)?.trim();
        const username = (fileData.get("username") as string)?.trim();
        const profile_pic = fileData.get("image") as File;

        if (!email && !username && !profile_pic) {
            return NextResponse.json({ message: "No data provided for update." }, { status: 400 });
        }

        const updateData: any = {};

        // Check email
        if (email) {
            const existingEmail = await User.findOne({ email, _id: { $ne: userid } });
            if (existingEmail) {
                return NextResponse.json({ message: "Email already in use." }, { status: 400 });
            }
            updateData.email = email.toLowerCase();
        }

        // Check username
        if (username) {
            const existingUsername = await User.findOne({ username, _id: { $ne: userid } });
            if (existingUsername) {
                return NextResponse.json({ message: "Username is already taken." }, { status: 400 });
            }
            updateData.username = username.toLowerCase();
        }

        // Handle profile image
        if (profile_pic && profile_pic.size > 0) {
            if (existingUser.profile_pic?.public_id) {
                await cloudinary.uploader.destroy(existingUser.profile_pic.public_id);
            }

            // Uploading image to cloudinary
            const uploadedImage = await uploadImageToCloudinary(profile_pic);

            updateData.profile_pic = uploadedImage;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ message: "No valid fields to update." }, { status: 400 });
        }

        const updatedProfile = await User.findByIdAndUpdate(userid, updateData, { new: true });

        return NextResponse.json({ message: "Profile updated successfully.", data: updatedProfile }, { status: 200 });

    } catch (error: any) {
        console.error("Profile update error:", error);
        return NextResponse.json({ message: error.message || "Server Error", error }, { status: 500 });
    }
}