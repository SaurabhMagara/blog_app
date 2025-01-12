import connectionToDatabase from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req : NextRequest){

    const db = await connectionToDatabase();
    return NextResponse.json({message : "Works properly"}, {status : 200});
}