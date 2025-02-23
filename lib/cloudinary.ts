import { v2 as cloudinary } from "cloudinary";

// cloudinary configuration for uploading images
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME! as string, // cloud name
    api_key: process.env.CLOUDINARY_API_KEY! as string, // api key from cloudinary
    api_secret: process.env.CLOUDINARY_API_SECRET! as string, // api secret key
});

export default cloudinary;