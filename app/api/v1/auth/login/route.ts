"use server"
import connectionToDatabase from "@/lib/db";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import mongoose from "mongoose";

const generateToken = async (userId : mongoose.Types.ObjectId) =>{
    try {
        const user = await User.findById(userId);
        if(!user){
            return NextResponse.json({message : "user not found"}, {status : 500});
        }

        const token = jwt.sign(
           { _id : user._id},`${process.env.JWT_SECRET!}`,{expiresIn : "7d"}
        );

        return token;
    } catch (error) {
        console.log("Error while generating token",error);
    }
}


export async function POST (req : NextRequest, res : NextResponse){
    try {
        await connectionToDatabase();

        const {email, username, password} = await req.json();

        if(!email && !username){
            return NextResponse.json({ message : "email or username is required to login."},{status : 401});
        }

        if(!password){
            return NextResponse.json({ message : "password is required to login."},{status : 401});        
        }

        const user = await User.findOne({
            $or : [{email}, {username}]
        });

        if(!user){
            return NextResponse.json({message : "Invalid Credantials"}, {status : 401});
        }


        const isCorrectPassword = await bcrypt.compare(password, user.password);

        if(!isCorrectPassword){
            return NextResponse.json({message : "Invalid Credantials"},{status : 401});
        }

        const token = await generateToken(user._id);
        const tkn = token?.toString();

        const cookie = await cookies();
        cookie.set("token", tkn, {httpOnly :true, expires :60*60*1000*24*7});

        return NextResponse.json({message : "Login successfully."}, {status : 200});

    } catch (error) {
        console.log(error);
        return NextResponse.json({message : "Something went wrong."}, {status : 500});
    }
}