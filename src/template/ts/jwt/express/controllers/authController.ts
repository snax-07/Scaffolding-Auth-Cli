import jwt from 'jsonwebtoken';
import type { SignOptions , JwtPayload} from 'jsonwebtoken';
import crypto from 'crypto';
import dbConnect from '../config/dbConnect.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import type { Request , Response } from 'express';


export const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY ?? '15m';
export const RTOKEN_EXPIRY = process.env.RTOKEN_EXPIRY ?? '7d';
const COOKIE_EXPIRY = process.env.COOKIE_EXPIRY || 30 * 24 * 60 * 60 * 1000; // 30 days

// In-memory storage for demo; use Redis/DB for production
const blackListedUserToken : string[] = [];
const validRefreshTokens : Record<string , string[]> = {}; // key = userId, value = array of active refresh token jtis
export const csrfSecrets : Record<string , string> = {}; // key = session/jti, value = CSRF token

// ================= Helper Functions =================

export const generateToken = (userId : string) => {
  const jti : string = crypto.randomUUID();

    const signOptions = (token : string) : SignOptions=>{
        return {
             algorithm: "HS256",
            expiresIn: token as Number | any,
            issuer : "AUTOMA"
        }
    };
  const accessToken = jwt.sign(
    {sub : userId , jti},
    process.env.JWT_SECRET as string,
    signOptions(TOKEN_EXPIRY)
  );

  const refreshToken = jwt.sign(
    { sub: userId, jti },
    process.env.JWT_SECRET as string,
    signOptions(RTOKEN_EXPIRY)
  );

  // Generate CSRF token for this session
  const csrfToken = crypto.randomBytes(24).toString('hex');
  csrfSecrets[jti] = csrfToken as string;

  // Store refresh token in memory
  if (!validRefreshTokens[userId]) validRefreshTokens[userId] = [];
  validRefreshTokens[userId].push(jti);

  return { accessToken, refreshToken, jti, csrfToken };
};

export const isTokenBlacklisted = (token :string) => blackListedUserToken.includes(token);

export const rotateRefreshToken = (userId : string, oldJti : string) => {
  // remove old JTI
  if (validRefreshTokens[userId]) {
    validRefreshTokens[userId] = validRefreshTokens[userId].filter(j => j !== oldJti);
  }
};

// ================= Controllers =================

/**
 * THIS FUNCTION USED FOR REGISTERING THE USER IN AND AUTO LOGIN FOR SEAMLESS EXP
 * @param req 
 * @param res 
 * @returns {ServerResponse}
 */
export const registerUser = async (
    req : Request<{} , {} , {username : string , email : string , password : string}>, res : Response
) => {
  try {
    await dbConnect();
    const { username, email, password }  = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: 'All fields required', success: false });

    if (await User.findOne({ username }))
      return res.status(409).json({ message: 'Username already exists', success: false });

    const newUser = new User({
      username,
      email,
      password: bcrypt.hashSync(password, 10),
    });

    const savedUser = await newUser.save();
    const { accessToken, refreshToken, csrfToken } = generateToken(savedUser._id);

    return res.status(201)
      .cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'Production', sameSite: 'strict', maxAge: 15 * 60 * 1000, path: '/' })
      .cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'Production', sameSite: 'strict', maxAge: COOKIE_EXPIRY as number, path: '/' })
      .cookie('csrfToken', csrfToken, { httpOnly: false, secure: process.env.NODE_ENV === 'Production', sameSite: 'strict', maxAge: COOKIE_EXPIRY as number, path: '/' })
      .json({ message: 'User registered successfully', success: true });
  } catch (error : any) {
    return res.status(500).json({ message: 'Internal server error', success: false, error: error.message || error });
  }
};



/**
 * THIS FUNCTION USED FOR LOGIN THE USER IN 
 * @param req 
 * @param res 
 * @returns {ServerResponse}
 */
export const loginUser = async (req : Request<{} , {} ,{identifier : string , password : string}>, res : Response) => {
  try {
    await dbConnect();
    const { identifier, password } = req.body;
    if (!identifier || !password)
      return res.status(400).json({ message: 'All fields required', success: false });

    const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });
    if (!user) return res.status(404).json({ message: 'User not found', success: false });

    if (!bcrypt.compareSync(password, user.password))
      return res.status(401).json({ message: 'Invalid credentials', success: false });

    const { accessToken, refreshToken, csrfToken } = generateToken(user._id);

    return res.status(200)
      .cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'Production', sameSite: 'strict', maxAge: 15 * 60 * 1000, path: '/' })
      .cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'Production', sameSite: 'strict', maxAge: COOKIE_EXPIRY as  number, path: '/' })
      .cookie('csrfToken', csrfToken, { httpOnly: false, secure: process.env.NODE_ENV === 'Production', sameSite: 'strict', maxAge: COOKIE_EXPIRY as number, path: '/' })
      .json({ message: 'Login successful', success: true });
  } catch (error : any) {
    return res.status(500).json({ message: 'Internal server error', success: false, error: error.message || error });
  }
};



/**
 * THIS FUNCTION USED FOR LOGOUT THE USER AND DELETE THE SESSION COOKIE
 * @param req 
 * @param res 
 * @returns {ServerResponse}
 */
export const logout = async (req : Request, res : Response) => {
  try {
    const { accessToken, refreshToken } = req.cookies;

    if (accessToken) blackListedUserToken.push(accessToken);
    if (refreshToken) {
      const decoded  = jwt.decode(refreshToken);
      if (decoded?.sub) rotateRefreshToken(decoded.sub as string, (decoded as any).jti);
      blackListedUserToken.push(refreshToken);
    }

    return res.status(200)
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .clearCookie('csrfToken')
      .json({ message: 'Logged out successfully', success: true });
  } catch (error : any) {
    return res.status(500).json({ message: 'Internal server error', success: false, error: error.message || error });
  }
};



/**
 * THIS FUNCTION USED FOR RETURNING THE EXIST USER FROM THE SESSION DATA AND MAKE SURE THAT USER MATCHES THE SESSION ENCRYPTION
 * @param req 
 * @param res 
 * @returns {ServerResponse}
 */
export const returnMe = async (req : Request, res : Response) => {
  try {
    const { accessToken, refreshToken, csrfToken: csrfHeader } = req.cookies;

    if (!accessToken) return res.status(401).json({ message: 'Access token missing', success: false });

    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET as string, { issuer: 'AUTOMA' });

      if (isTokenBlacklisted(accessToken)) throw new Error('Token blacklisted');

      // CSRF check for sensitive requests
      if (req.method !== 'GET' && req.headers['x-csrf-token'] !== csrfSecrets[(decoded as any).jti])
        return res.status(403).json({ message: 'CSRF token mismatch', success: false });

    } catch (err : any) {
      if (err.name === 'TokenExpiredError') {
        if (!refreshToken) return res.status(401).json({ message: 'Refresh token missing', success: false });

        try {
          const refreshDecoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string, { issuer: 'AUTOMA' });
          if (isTokenBlacklisted(refreshToken)) throw new Error('Refresh token blacklisted');

          // Rotate refresh token
          rotateRefreshToken(refreshDecoded.sub as string, (refreshDecoded as any).jti);

          const { accessToken: newAccessToken, refreshToken: newRefreshToken, csrfToken } = generateToken(refreshDecoded.sub as string);

          res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'Production', sameSite: 'strict', maxAge: 15 * 60 * 1000, path: '/' });
          res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'Production', sameSite: 'strict', maxAge: COOKIE_EXPIRY as number, path: '/' });
          res.cookie('csrfToken', csrfToken, { httpOnly: false, secure: process.env.NODE_ENV === 'Production', sameSite: 'strict', maxAge: COOKIE_EXPIRY as number, path: '/' });

          decoded = jwt.decode(newAccessToken);
        } catch {
          return res.status(401).json({ message: 'Invalid refresh token', success: false });
        }
      } else {
        return res.status(401).json({ message: 'Invalid access token', success: false });
      }
    }

    await dbConnect();
    const user = await User.findById(decoded?.sub as string).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found', success: false });

    return res.status(200).json({ message: 'User fetched', success: true, user });
  } catch (error : any) {
    return res.status(500).json({ message: 'Internal server error', success: false, error: error.message || error });
  }
};
