import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IComment extends Document {
    userId: Types.ObjectId;
    blogId: Types.ObjectId;
    text: string;
    createdAt: Date;
    updatedAt: Date;
}

// Comment Schema
const commentSchema: Schema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        blogId: {
            type: Schema.Types.ObjectId,
            ref: "Blog",
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

// Export Model
export const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>("Comment", commentSchema);