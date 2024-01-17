import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.SECREAT_KEY;

//  generate JWT tokens -> Access Token
const generateToken = (user) => {
  const payload = {
    id: user.id,
    name: user.name,
    role: user.role.name, // name field in role model
  };

  return jwt.sign(payload, secretKey, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY, //1hr
  });
};

//verifying the token
const verifyToken = async (req, res, next) => {
  //getting the token from header
  const accessToken = await req.headers.x_access_token;
  const refToken = await req.headers.x_refresh_token;
  try {
    const isAccessTokenExp = isAccessTokenExpired(accessToken, secretKey, req);

    if (isAccessTokenExp) {
      const isRefreshTokenExp = isRefreshTokenExpired(refToken, secretKey, req, res);

      if (isRefreshTokenExp) return res.status(403).json({ message: "Session is expired.Please log in again" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

//checking manager
const isManager = async (req, res, next) => {
  if ((await req.user.role) !== "manager") {
    return res.status(403).json({ message: "Access denied. Manager role required." });
  }

  next();
};
//  Refresh Token
const refreshToken = (user) => {
  const payload = {
    id: user.id,
    name: user.name,
    role: user.role.name, // name field in role model
  };
  return jwt.sign(payload, secretKey, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY,
  }); //4hr
};

function isAccessTokenExpired(accessToken, secretKey, req) {
  try {
    const decoded = jwt.verify(accessToken, secretKey);

    req.user = decoded;
    return false; //valid user
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return true;
    }
  }
}

function isRefreshTokenExpired(refToken, secretKey, req, res) {
  try {
    const decoded = jwt.verify(refToken, secretKey);
    req.user = decoded;

    const access = generateToken(decoded);

    const refresh = refreshToken(decoded);

    res.setHeader("x_access_token", access);
    res.setHeader("x_refresh_token", refresh);
    return false; //user valid
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return true;
    }
  }
}

export { verifyToken, generateToken, isManager, refreshToken };
