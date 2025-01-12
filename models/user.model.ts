import mongoose, { Schema } from "mongoose";

// user document type,  because of typescript
export interface user extends Document {
    name : string;
    email : string;
    password : string;
    role : string;
    createdAt : Date;
    updatedAt : Date
}

//defining Schema of user
const userSchema : Schema = new Schema(
    {
        name : {
            type : String,
            required : true,
        },
        email :{
            type : String,
            required : true
        },
        password : {
            type : String,
            required : true
        },
        role : {
            type : String,
            default : "user"
        }
    },
    {
        timestamps : true
    }
)

// giving types to everything for type saftey
// if there is not user modle then it creates new otherswise use existing one
export const User : mongoose.Model<user> = mongoose.models.User || mongoose.model<user>("User", userSchema)