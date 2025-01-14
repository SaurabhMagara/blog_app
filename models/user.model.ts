import mongoose, { Schema } from "mongoose";
import { blog } from "./blog.model";
import { unique } from "next/dist/build/utils";

// user document type,  because of typescript
export interface user extends Document {
    username : string;
    email : string;
    password : string;
    blogs : Schema.Types.ObjectId []
    createdAt : Date;
    updatedAt : Date
}



//defining Schema of user
const userSchema : Schema = new Schema(
    {
        username : {
            type : String,
            required : true,
            trim : true,
            unique : true
        },
        email :{
            type : String,
            required : true,
            trim : true,
            unique :true
        },
        password : {
            type : String,
            required : true,
            trim :true
        },
        blogs:[
            {
                type: Schema.Types.ObjectId,
                ref:"Blog",
            }
        ]
    },
    {
        timestamps : true
    }
)

// if there is not user modle then it creates new otherswise use existing one
export const User : mongoose.Model<user> = mongoose.models.User || mongoose.model<user>("User", userSchema)