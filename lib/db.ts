import mongoose from "mongoose";

const uri = process.env.DB_URI! as string;

if (!uri) {
    throw new Error("env error : db uri is missing");
}

async function connectionToDatabase(){

    try {
        mongoose.connect(uri!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        })

        connection.on('error', (err) => {
            console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
            process.exit();
        })

    } catch (error) {
        console.log('Something goes wrong!');
        console.log(error);
        
    }
}

export default connectionToDatabase;