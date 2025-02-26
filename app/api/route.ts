"use server";

// ------------Login route-----------------------

import connectionToDatabase from "@/lib/db";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";


const generateToken = (userId: mongoose.Types.ObjectId, email :string, username: string): string => {
    try {
        const token = jwt.sign(
            { _id: userId, email, username }, // Payload
            process.env.JWT_SECRET!, // Secret
            { expiresIn: "1d" } // Options
        );
        return token;
    } catch (error) {
        console.error("Error while generating token:", error);
        throw new Error("Token generation failed.");
    }
};

export async function POST(req: Request) {
    try {
        await connectionToDatabase();

        const { email, username, password } = await req.json();

        // Validate inputs
        if (!email && !username) {
            return NextResponse.json(
                { message: "Email or username is required to login." },
                { status: 400 }
            );
        }

        if (!password) {
            return NextResponse.json(
                { message: "Password is required to login." },
                { status: 400 }
            );
        }

        // Find the user by email or username
        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (!user) {
            return NextResponse.json(
                { message: "Invalid credentials." },
                { status: 401 }
            );
        }

        // Compare the provided password with the hashed password
        const isCorrectPassword = await bcrypt.compare(password, user.password);
        if (!isCorrectPassword) {
            return NextResponse.json(
                { message: "Invalid credentials." },
                { status: 401 }
            );
        }

        // Generate a JWT token
        const token = generateToken(user._id, user.email, user.username);

        const data = { 
            _id : user._id,
            email : user.email,
            username : user.username
        }
        // Create the response and set the cookie
        const response = NextResponse.json(
            { message: "Login successful.", data : data },
            { status: 200 }
        );

        response.cookies.set("token", token, {
            httpOnly: true,
            path: "/", // Cookie available throughout the site
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        });

        return response;
    } catch (error: any) {
        console.error("Login error:", error?.message);
        return NextResponse.json(
            { message: "Something went wrong." },
            { status: 500 }
        );
    }
}
