"use server"

import connectionToDatabase from "@/lib/db";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

// get users routes

export async function POST(req : NextRequest){
    try {
        await connectionToDatabase();

        const users = await User.find({}).populate("blogs").select(["-password"]);

        if(!users){
            return NextResponse.json({message : "There are no users.", data : []},{status : 200});
        }

        return NextResponse.json({message : "Users retrived!", data : users},{status : 200});
    } catch (error : any) {
        console.log(error);
        return NextResponse.json({message : error.message || "Something went wrong", error : error}, {status : 500});
    }
}