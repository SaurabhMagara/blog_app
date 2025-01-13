import connectionToDatabase from "@/lib/db";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req : NextRequest, res : NextResponse){
    try {
        await connectionToDatabase();

        const {email, password, name} = await req.json();
        
        if(!email || !password || !name){
            return NextResponse.json({message : "All fields are required."}, {status : 401});
        }

        const existingUser = await User.findOne({email : email});

        if(existingUser){
            return NextResponse.json({message : "Email already in use!"},{status : 401});
        }

        const genSalt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, genSalt);

        const user = new User({
            name,
            email,
            password : hashedPassword,
        });

        await user.save();

        return NextResponse.json({message : "Registered Successfully"});

    } catch (error) {
        console.log(error);
        return NextResponse.json({message : "Somwthing went wrong."}, {status : 500});
    }
}