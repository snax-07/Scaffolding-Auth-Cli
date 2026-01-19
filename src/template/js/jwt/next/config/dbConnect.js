import mongoose, { mongo } from 'mongoose'

const connected = {};

export async function dbConnect(){
    try {
        if(connected.isConnected){
            console.log("Database is already connected !!");
            return;
        }

        if(!process.env.MONGODB_URI){
            throw new Error("Mongo db uri is no defined name under the also in JS.");
        }

        const connect = await mongoose.connect(process.env.MONGODB_URI);
        connected.isConnected = connect.connection.readyState === "1";

        console.log("Databases is only conexted successfully !!!")
    } catch (error) {
        console.log("Error while connecting database !!!!");
        process.exit(0);
    }
}