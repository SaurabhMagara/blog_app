import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { User } from "./user.model";

export interface IBlog extends Document {
    postedBy: Types.ObjectId;
    title: string;
    content: string;
    image: {
        public_id: string;  // Cloudinary image ID (needed for deletion)
        url: string;         // Cloudinary URL (for display)
    };
    likes: Types.ObjectId[];
    comments: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

// Blog Schema
const BlogSchema: Schema = new Schema(
    {
        postedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        image: {
            public_id: {
                type: String, required: true // Store Cloudinary image ID
            }, 
            url: {
                type: String, required: true // Store Cloudinary image URL
            },       
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        likes: {
            type: Number,
            default: 0,
        },
        comments: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { timestamps: true }
);

// Export Model
export const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>("Blog", BlogSchema);