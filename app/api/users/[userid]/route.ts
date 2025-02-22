"use server"

import connectionToDatabase from "@/lib/db";
import { User } from "@/models/user.model";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

// get use by use id route

export async function GET(req : NextResponse, {params} : {params : {userid : string}}){
    try {

        await connectionToDatabase();
        const {userid} = params;

        if(!userid){
            return NextResponse.json({message : "userid is required"});
        }

        if(!isValidObjectId(userid)){
            return NextResponse.json({message : "Invalid userid"}, {status : 400});
        }

        const user = await User.findOne({_id : userid})?.populate("blogs");

        if(!user){
            return NextResponse.json({message : "user not found"}, {status : 400});
        }

        return NextResponse.json({message : "User details recieved", data : user}, {status : 200});
        
    } catch (error : any) {
        console.log(error);
        return NextResponse.json({message : error.message || "Something went wrong", error : error}, {status : 500});
    }
}