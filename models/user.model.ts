import mongoose, { Schema, Types, Model } from "mongoose";

// user document type,  because of typescript
export interface IUser extends Document {
    username: string;
    profile_pic : {
        url : string,
        public_id : string
    }
    email: string;
    password: string;
    blogs: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
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
            unique :true,
        },
        password : {
            type : String,
            required : true,
            trim :true
        },
        profile_pic : {
            url :{
                type : String
            },
            public_id : {
                type :String
            }
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
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);