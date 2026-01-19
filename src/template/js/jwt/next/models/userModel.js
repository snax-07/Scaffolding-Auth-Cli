import {Schema , models , model} from 'mongoose'

const UserSchema = new Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    }
});

const User = models.User || new model("User" , UserSchema);
export default User;