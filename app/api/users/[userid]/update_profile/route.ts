"use server"

import cloudinary from "@/lib/cloudinary";
import { User } from "@/models/user.model";
import { isValidObjectId } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";


interface ContextType {
    params: Promise<{ userid: string }>
}

export async function POST(req: NextRequest, context: ContextType) {
    try {
        const { userid } = await context.params;

        const fileData = await req.formData();

        const email = fileData.get("email") as string;
        const username = fileData.get("username") as string;
        const profile_pic = fileData.get("image") as File;


        if (!email && !username && !profile_pic) {
            return NextResponse.json({ message: "Please fill field to update." }, { status: 400 });
        }

        if (!userid || !isValidObjectId(userid)) {
            return NextResponse.json({ message: "Invalid userid." }, { status: 400 });
        }

        const existingUser = await User.findById(userid);

        if (!existingUser) {
            return NextResponse.json({ message: "Invalid userid, no user with id" }, { status: 400 });
        }

        let updatedProfile;

        // check if all fields are available then update three of them
        if((profile_pic) && (email && username) && (email.trim() !== "" && username.trim() !== "")){

            
            // first delete exsting image from cloudinary
            await cloudinary.uploader.destroy(existingUser.profile_pic.public_id);

            const buffer = Buffer.from(await profile_pic?.arrayBuffer());
            const stream = Readable.from(buffer);

            const uploadPromise = new Promise<{ url: string; public_id: string }>((resolve, reject) => {
                const cloudinaryUpload = cloudinary.uploader.upload_stream(
                    { folder: "nextjs_uploads" },
                    (error, result) => {
                        if (error || !result) return reject(error);
                        resolve({ url: result.secure_url, public_id: result.public_id });
                    }
                );
                stream.pipe(cloudinaryUpload);
            });

            const uploadedImage = await uploadPromise;

            if (!uploadedImage) {
                return NextResponse.json({ message: "Upload failed" }, { status: 500 });
            }

            updatedProfile = await User.findByIdAndUpdate(userid,
                {
                    username :username.toLowerCase(),
                    email : email.toLowerCase(),
                    profile_pic : {
                        url : uploadedImage.url,
                        public_id : uploadedImage.public_id
                    }
                },{new : true}
            );

            return NextResponse.json({message : "Profile updated.", data : updatedProfile},{status :200});
        }

        //checking if profile exists
        if (profile_pic || profile_pic !== "") {

            // first delete existing image from cloudinary
            await cloudinary.uploader.destroy(existingUser.profile_pic.public_id);

            const buffer = Buffer.from(await profile_pic?.arrayBuffer());
            const stream = Readable.from(buffer);

            const uploadPromise = new Promise<{ url: string; public_id: string }>((resolve, reject) => {
                const cloudinaryUpload = cloudinary.uploader.upload_stream(
                    { folder: "nextjs_uploads" },
                    (error, result) => {
                        if (error || !result) return reject(error);
                        resolve({ url: result.secure_url, public_id: result.public_id });
                    }
                );
                stream.pipe(cloudinaryUpload);
            });

            const uploadedImage = await uploadPromise;

            if (!uploadedImage) {
                return NextResponse.json({ message: "Upload failed" }, {status: 500});
            }


            // checking if email and username is not updating then only update profile pic
            if((!email && !username) || (email.trim() === "" && username.trim() === "")){

                updatedProfile = await User.findByIdAndUpdate(userid,
                    {
                        profile_pic :{
                            public_id : uploadedImage.public_id,
                            url : uploadedImage.url
                        }
                    },{new : true}
                );

                return NextResponse.json({message : "Profile pic updated.", data : updatedProfile},{status :200});

            }// if user is updating email with profile pic then update both
            else if((email || email.trim() !== "") && (!username || username.trim() == "")){

                const existingUserWithEmail = await User.findOne({email});

                if(existingUserWithEmail){
                    return NextResponse.json({message : "Email already in use."},{status :400});
                }

                updatedProfile = await User.findByIdAndUpdate(userid,
                    {
                        email : email.toLowerCase(),
                        profile_pic : {
                            url : uploadedImage.url,
                            public_id : uploadedImage.public_id
                        }
                    },{new : true}
                )

                return NextResponse.json({message : "Email and Profile pic updated.", data : updatedProfile},{status:200});

            } // now check if user is updating username and profile pic
            else if((username || username.trim() !== "") && (!email || email.trim() === "")){
                const existingUserWithUsername = await User.findOne({username});

                if(existingUserWithUsername){
                    return NextResponse.json({message : "username is in use."},{status :200});
                }

                updatedProfile = await User.findByIdAndUpdate(userid,
                    {
                        username : username.toLowerCase(),
                        profile_pic : {
                            url : uploadedImage.url,
                            public_id : uploadedImage.public_id
                        }
                    },{new :true}
                );

                return NextResponse.json({message : "Username and Profile pic updated.", data : updatedProfile},{status :200});
            }
        }


        // if username and email both are updating by user
        if((username && email) && (email.trim() !== "" && username.trim() !== "")){
            
            const existingUserWithEmail = await User.findOne({email});

            if(existingUserWithEmail){
                return NextResponse.json({message : "Email is already in use"}, {status  : 400});
            }

            const existingUserWithUsername = await User.findOne({username});

            if(existingUserWithUsername){
                return NextResponse.json({message : "Username is already taken."},{status :400});
            }

            updatedProfile = await User.findByIdAndUpdate(userid,
                {
                    email : email.toLowerCase(),
                    username : username.toLowerCase(),
                },{new :true}
            );

            return NextResponse.json({message : "Username and Email updated.", data : updatedProfile},{status :200});
        }

        // if user only updating username
        if((username || username.trim() !== "") && (!email || email.trim() === "")){

            const existingUserWithUsername = await User.findOne({username});

            if(existingUserWithUsername){
                return NextResponse.json({message : "Username is already taken."},{status :400});
            }

            updatedProfile = await User.findByIdAndUpdate(userid,
                {
                    username : username.toLowerCase()
                },{new  : true}
            );

            return NextResponse.json({message : "Username is updated", data : updatedProfile},{status : 200});
        }

        // if user only updating email
        if((email  || email.trim() !== "") && (!username || username.trim() === "")){

            const existingUserWithEmail = await User.findOne({email});

            if(existingUserWithEmail){
                return NextResponse.json({message : "Email already in use."},{status :400});
            }

            updatedProfile = await User.findByIdAndUpdate(userid,
                {
                    email : email.toLowerCase()
                },{new : true}
            );

            return NextResponse.json({message : "Email updated", data : updatedProfile},{status : 200});
        }

    } catch (error: any) {
        console.log(error);
        return NextResponse.json({ message: error?.message || "Something went wrong.", error }, { status: 500 });
    }
}