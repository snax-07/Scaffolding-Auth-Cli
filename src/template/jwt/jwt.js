import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import <%= userModel %> from ../model/<%= userModel %>.<%= ext %>

const Authnticator = async (payload) => {
    try {

        if(!payload || !payload.token || !payload.secret) return {
            success : false,
            message : "Parameteres are missing !!!",
            error : "Provide all params !!!"
        }
        const userPayload = jwt.verify(payload.token , payload.secret , {
            algorithms : ["HS256"],
            maxAge : "1d"
        });

        const isUserExist = await <%= userModel %>.findOne({_id : new mongoose.Types.ObjectId(userPayload._id)});

        if(!isUserExist) return {
            success : false,
            message : "User is not exist !!!",
            error : "User not found !!!"
        }


        return {
            success : true,
            message : "User Verified Successfully !!!",
            user    : isUserExist
        }
    } catch (error) {
        return {
            success : false,
            message : "Authenticator Error !!!",
            error : error.message || error
        }
    }
}



export Authnticator