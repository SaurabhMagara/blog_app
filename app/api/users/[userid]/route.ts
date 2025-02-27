"use server";

import connectionToDatabase from "@/lib/db";
import { User } from "@/models/user.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// expected structure of context.params
interface ContextType {
  params: Promise<{ userid: string }>;
}

// GET handler to retrieve user details by user ID
export async function GET(req: NextRequest, context: ContextType) {
  try {
    await connectionToDatabase();

    const { userid } = await context.params;

    if (!userid) {
      return NextResponse.json({ message: "userid is required" }, { status: 400 });
    }

    if (!isValidObjectId(userid)) {
      return NextResponse.json({ message: "Invalid userid" }, { status: 400 });
    }

    const user = await User.findById(userid).select("-password").populate("blogs");

    if (!user) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User details received", data: user }, { status: 200 });
  } catch (error: any) {
    // Log the error and return a server error response
    console.error(error);
    return NextResponse.json(
      { message: error.message || "Something went wrong", error },
      { status: 500 }
    );
  }
}
