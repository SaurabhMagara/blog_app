import mongoose,{Schema, Document} from "mongoose";

export interface blog extends Document{
    postedBy : string;
    title : string;
    content :string;
}

const blogSchema : Schema = new Schema(
    {
        postedBy :{
            type : Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        photo :{
            type : String, // cloudinary url
            required : true,
        },
        title :{
            type : String,
            required : true,
            trim : true
        },
        content : {
            type :String,
            required :true
        }
    },
    {timestamps :true}
)

export const Blog :mongoose.Model<blog> = mongoose.models.Blog || mongoose.model<blog>("Blog", blogSchema);