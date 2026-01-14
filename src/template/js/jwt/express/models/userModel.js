import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    username : {
        type : string,
        required : true,
        unique : true
    },
    
    email : {
        type : string,
        required : true,
        unique : true
    },
    password : {
        type : string,
        required : true
    }
});


const User =  mongoose.models.User ||  mongoose.model("User" , UserSchema);
export default User;