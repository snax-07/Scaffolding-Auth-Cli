import jwt from "jsonwebtoken";
import dbConnect from "../config/dbConnect.js";
import User from "../models/userModel.js";
import type { Request , Response , NextFunction , CookieOptions } from "express";
import {
  generateToken,
  rotateRefreshToken,
  isTokenBlacklisted,
  csrfSecrets
} from "../controllers/authController.js";


const ACCESS_COOKIE_OPTIONS : CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "Production",
  sameSite: "strict",
  maxAge: 15 * 60 * 1000,
  path: "/",
};

const REFRESH_COOKIE_OPTIONS : CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "Production",
  sameSite: "strict",
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: "/",
};

const CSRF_COOKIE_OPTIONS : CookieOptions = {
  httpOnly: false,
  secure: process.env.NODE_ENV === "Production",
  sameSite: "strict",
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: "/",
};
interface LocalAuthGenericUser{
    user : {
        _id : string,
        username : string,
        email : string
    },

    auth : {
        userId : string,
        jti : string
    }
}

interface customRequestGenericType extends Request{
    user ?: LocalAuthGenericUser["user"],
    auth ?: LocalAuthGenericUser["auth"]
}

/**
 * Auth Guard Middleware
 * - Handles access token and their exp time range
 * - Handles refresh token rotation meanse remove the old refreshToken and new one for next operation and also handle the exp
 * - Enforces CSRF
 * - Attaches user to req
 */
export const authGuard = async (req : customRequestGenericType, res : Response, next : NextFunction) => {
  try {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;
    const csrfHeader = req.headers["x-csrf-token"];

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Access token missing",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string, {
        issuer: "AUTOMA",
      });

      if (isTokenBlacklisted(accessToken)) {
        throw new Error("Access token blacklisted");
      }
    } catch (err : any) {
 
      if (err.name !== "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Invalid access token",
        });
      }

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Refresh token missing",
        });
      }

      let refreshDecoded;
      try {
        refreshDecoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string, {
          issuer: "AUTOMA",
        });

        if (isTokenBlacklisted(refreshToken)) {
          throw new Error("Refresh token blacklisted");
        }
      } catch {
        return res.status(401).json({
          success: false,
          message: "Invalid refresh token",
        });
      }


      rotateRefreshToken(refreshDecoded.sub as string, (refreshDecoded as any).jti);

      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        csrfToken,
      } = generateToken(refreshDecoded.sub as string);

      res.cookie("accessToken", newAccessToken, ACCESS_COOKIE_OPTIONS);
      res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);
      res.cookie("csrfToken", csrfToken, CSRF_COOKIE_OPTIONS);

      decoded = jwt.decode(newAccessToken);
    }

    if (req.method !== "GET") {
      const expectedCsrf = csrfSecrets[(decoded as any)?.jti];

      if (!csrfHeader || csrfHeader !== expectedCsrf) {
        return res.status(403).json({
          success: false,
          message: "CSRF token mismatch",
        });
      }
    }


    await dbConnect();

    const user = await User.findById(decoded?.sub as string).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    req.auth = {
      userId: decoded?.sub as string,
      jti: (decoded as any).jti,
    };

    return next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};
