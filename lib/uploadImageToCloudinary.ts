import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";

export const uploadImageToCloudinary = async (file: File): Promise<{ url: string; public_id: string }> => {
    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = Readable.from(buffer);

    return new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
            { folder: "nextjs_uploads" },
            (error, result) => {
                if (error || !result) return reject(error);
                resolve({ url: result.secure_url, public_id: result.public_id });
            }
        );
        stream.pipe(upload);
    });
};