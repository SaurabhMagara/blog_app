import { User } from "@/models/user.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

interface ContextType {
    params : Promise<{userid : string}>
}

export async function POST(req : NextRequest, context : ContextType){
    try {
        
        const {userid} = await context.params;
        const {currentPassword, confirmPassword} = await req.json();

        if(!userid || !isValidObjectId(userid)){
            return NextResponse.json({message: "Invalid userid."},{status :400});
        }

        if(!currentPassword || !confirmPassword){
            return NextResponse.json({message  : "Current password and Confirm password is required."},{status : 400});
        }

        if(currentPassword.trim() === confirmPassword.trim()){
            return NextResponse.json({message  :"Current password and Confirm password must be different."},{status :400});
        }

        const existingUser = await User.findById(userid);

        if(!existingUser){
            return NextResponse.json({message : "Invalid userid : user not found"}, {status  :400});
        }

        const isPasswordCorrect = await bcrypt.compare(currentPassword, existingUser.password);

        if(!isPasswordCorrect){
            return NextResponse.json({message : "Incorrect password."},{status :400});
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(confirmPassword,salt);

        await User.findByIdAndUpdate(userid,
            {
                password : hashedPassword
            }
        );

        return NextResponse.json({message : "Password updated."},{status : 200});

    } catch (error : any) {
        console.log(error);
        return NextResponse.json({message  :error?.message || "Something went wrong", error},{status :500});
    }
}