import mongoose from "mongoose";
import { validPassword, genPassword, issueJWT } from "../lib/utils.js";

const User = mongoose.model("User");

//get all users
const getUsers = async (req, res) => {
  const users = await User.find();
  return users;
};

//called when user login
export const userLogin = async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (!user)
    return res.json({
      success: false,
      msg: "Could not find user",
    });

  const isValid = validPassword(user.password, req.body.password);

  if (isValid) {
    const tokenObject = issueJWT(user);

    return res.status(200).json({
      success: true,
      user: { userId: user._id, username: user.username },
      token: tokenObject.token,
    });
  } else {
    return res.json({ success: false, msg: "You entered wrong credentials" });
  }
};

//called when new user register an account
export const userRegister = async (req, res, next) => {
  const { username, email, password } = req.body;

  const users = await getUsers();

  let takenUsername = false;
  let takenEmail = false;

  users.forEach((user) => {
    if (user.username === username) {
      takenUsername = true;
    } else if (user.email === email) {
      takenEmail = true;
    }
  });

  const userPw = genPassword(password);

  const newUser = new User({
    username,
    email,
    password: userPw,
  });

  if (takenUsername) {
    return res.json({ success: false, msg: "Username already exist" });
  } else if (takenEmail) {
    return res.json({ success: false, msg: "Email already exist" });
  } else {
    const savedUser = await newUser.save();

    const jwt = issueJWT(savedUser);

    return res.status(200).json({
      success: true,
      user: { userId: savedUser._id, username: savedUser.username },
      token: jwt.token,
    });
  }
};
