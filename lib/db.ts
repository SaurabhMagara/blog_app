import mongoose from "mongoose";
import {User} from '../models/user.model'; // Ensure this import happens AFTER the model is defined

const uri = process.env.DB_URI! as string;

if (!uri) {
    throw new Error("env error : db uri is missing");
}

async function connectionToDatabase(){

    if (mongoose.connections[0].readyState){
        console.log("Using existing connection.");
        return;
    } 

    try {
        
        await mongoose.connect(uri!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        })

        connection.on('error', (err) => {
            console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
            process.exit(1);
        })

    } catch (error) {
        console.log('Something went wrong!');
        console.log(error);
        process.exit(1);
        
    }
}

export default connectionToDatabase;