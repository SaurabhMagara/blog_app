import mongoose, {Schema, Document} from "mongoose";
import { User } from "./user.model";
import { Blog } from "./blog.model";

export interface like extends Document{
    userid : typeof User,
    blogid : typeof Blog,
}

const likeSchema = new Schema<like>(
    {
        userid : {
            type: Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        blogid : {
            type : Schema.Types.ObjectId,
            ref : "Blog",
            required  :true
        },
    },
    {timestamps : true}
);

export const Like: mongoose.Model<like> = mongoose.models.Like || mongoose.model<like>("Like", likeSchema);