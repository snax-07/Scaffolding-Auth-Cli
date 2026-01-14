import mongoose from 'mongoose'

const isConncted = {};

export default async function dbConnect() {
    try {
        if(isConncted.connected){
            console.log("Database is already Connected !!!");
            return;
        }
        const con = await mongoose.connect(process.env.MONGODB_URI);
        isConncted.connected = con.connection.readyState;
        console.log(`Database connected successfully to ${con.connection.host}`);
    } catch (error) {
        console.log("Error while connecting database !!!");
    }
}