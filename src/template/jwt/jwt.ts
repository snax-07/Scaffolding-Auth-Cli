import jwt, { JsonWebTokenError, type JwtPayload } from 'jsonwebtoken'
import mongoose from 'mongoose'
import <%= userModel %> from "../model/<%= userModel %>.<%= ext %>"


export interface JWTPayload {
    token : string,
    secret : string,
}
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}
const secret_jwt = process.env.JWT_SECRET;



const Authnticator = async (payload : JWTPayload) => {
    try {

        if(!payload || !payload.token) return {
            success : false,
            message : "Parameteres are missing !!!",
            error : "Provide all params !!!"
        }
        const userPayload = jwt.verify(payload.token ,secret_jwt , {
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
    } catch (error : JsonWebTokenError) {
        return {
            success : false,
            message : "Authenticator Error !!!",
            error : error.message || error
        }
    }
}

const tokenGenerator = (payload : JwtPayload) => {
    const accessToken = jwt.sign(payload , secret_jwt , {
        expiresIn : "15m",
        algorithm : "HS256",
    });

    const refreshToken = jwt.sign(
        payload,
        secret_jwt,
        {
            expiresIn : "7d",
            algorithm : "HS256",
            audience : "web-app",
            issuer : "automa.snax.org"
        }
    );

    return {accessToken , refreshToken};
}



export {Authnticator , tokenGenerator}