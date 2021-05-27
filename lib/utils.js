import crypto from "crypto";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const validPassword = (userPw, reqPw = "") => {
  // Defining key
  const secret = process.env.PUB_KEY;
  // Calling createHash method
  const hash = crypto
    .createHash("sha256", secret)
    // updating data
    .update(reqPw)
    // Encoding to be used
    .digest("hex");

  return userPw === hash;
};

export const genPassword = (reqPw) => {
  // Defining key
  const secret = process.env.PUB_KEY;
  // Calling createHash method
  const hash = crypto
    .createHash("sha256", secret)
    // updating data
    .update(reqPw)
    // Encoding to be used
    .digest("hex");

  return hash;
};

export const issueJWT = (user) => {
  const _id = user._id;

  const expiresIn = "1d";

  const payload = {
    sub: _id,
    iat: Date.now(),
  };

  const signedToken = jsonwebtoken.sign(payload, process.env.PRIV_KEY);

  return {
    token: "Bearer " + signedToken,
  };
};
