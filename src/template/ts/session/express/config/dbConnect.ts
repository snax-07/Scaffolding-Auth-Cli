import mongoose from 'mongoose'

const isConncted : {connected ?: boolean} = {};


export default async function dbConnect() {
    try {
        if(isConncted.connected){
            console.log("Database is already Connected !!!");
            return;
        }
        const con = await mongoose.connect(process.env.MONGODB_URI as string);
        isConncted.connected = con.connection.readyState === 1;
        console.log(`Database connected successfully to ${con.connection.host}`);
    } catch (error) {
        console.log("Error while connecting database !!!");
    }
}