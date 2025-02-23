import mongoose from "mongoose";

const uri = process.env.DB_URI! as string;

if (!uri) {
    throw new Error("env error : db uri is missing");
}

let isConnected = false; // Track connection status

async function connectionToDatabase(){

    try {
        if (isConnected) {
            console.log("⚡ Using existing MongoDB connection");
            return;
        }
       const db = await mongoose.connect(uri!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB connected successfully');
            isConnected = !!db.connections[0].readyState;
        })

        connection.on('error', (err) => {
            console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
            process.exit(1);
        })

    } catch (error) {
        console.log('Something went wrong!');
        console.log(error);
        
    }
}

export default connectionToDatabase;