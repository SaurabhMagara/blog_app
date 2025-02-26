"use server"

import connectionToDatabase from "@/lib/db";
import { NextResponse } from "next/server";

// logout route

export default async function POST (){
    try {
        await connectionToDatabase();

        const response =  NextResponse.json({message : "Logged out successfully."},{status : 200});

        response.cookies.set("token", "", {httpOnly : true, path : "/", expires : 0});

        return response;

    } catch (error :any) {
        return NextResponse.json({error : error.message}, {status : 500});
    }
}