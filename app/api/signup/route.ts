"use server"

import connectionToDatabase from "@/lib/db";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

// rehister user route or signup route

export async function POST(req : NextRequest, res : NextResponse){
    try {
        await connectionToDatabase();

        const {email, password, username} = await req.json();
        
        if(!email || !password || !username){
            return NextResponse.json({message : "All fields are required."}, {status : 401});
        }

        const existingUser = await User.findOne({
            $or :[{email}, {username}]
        });

        if(existingUser){
            return NextResponse.json({message : "Email or username already in use!"},{status : 401});
        }

        const genSalt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, genSalt);

        const user = new User({
            username,
            email,
            password : hashedPassword,
        });

        const newUser = await user.save();

        return NextResponse.json({message : "Registered Successfully", data :newUser },{status : 201});

    } catch (error :any) {
        console.log(error);
        return NextResponse.json({error : error.message ||"Something went wrong."}, {status : 500});
    }
}