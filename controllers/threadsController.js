import mongoose from "mongoose";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const User = mongoose.model("User");
const Thread = mongoose.model("Thread");
const Comment = mongoose.model("Comment");

//get all threads
export const getAllThreads = async (req, res) => {
  let threads = await Thread.find().sort({ createdAt: -1 });
  return res.status(200).json({ success: true, threads });
};

//add new thread
export const addThread = async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization)
    return res
      .status(401)
      .json({ success: false, msg: "You are not authorized" });

  const token = authorization.split(" ")[1];
  const decoded = jsonwebtoken.verify(token, process.env.PRIV_KEY);

  const user = await User.findOne({ _id: decoded.sub });

  try {
    const newThread = new Thread({
      userId: decoded.sub,
      userName: user.username,
      createdAt: Date.now(),
      content: req.body.content,
    });

    if (!newThread.content) throw new Error("Missing content");

    const savedThread = await newThread.save();
    return res.status(200).json({ success: true, msg: "Thread added" });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ success: false, msg: "Cannot add thread" });
  }
};

//get all threads of specific user
export const getUserThreads = async (req, res) => {
  const { id } = req.params;

  const threads = await Thread.find({ userId: id }).sort({ createdAt: -1 });

  if (!threads || threads.length === 0)
    return res
      .status(400)
      .json({ success: false, msg: "Cannot find threads by that user id" });

  return res.status(200).json({ success: true, threads });
};

//get single thread with all comments
export const getSingleThread = async (req, res) => {
  const { id } = req.params;
  try {
    const thread = await Thread.findById(id);
    const comments = await Comment.find({ threadId: id }).sort({
      createdAt: -1,
    });

    const data = { success: true, ...thread._doc, comments };

    if (!thread) throw new Error("Thread not found");

    return res.status(200).json(data);
  } catch (err) {
    console.log(err.message);
    return res
      .status(400)
      .json({ success: false, msg: "Cannot get thread by that id" });
  }
};

//update a thread
export const updateThread = async (req, res) => {
  const { id } = req.params;

  const { authorization } = req.headers;

  if (!authorization)
    return res
      .status(401)
      .json({ success: false, msg: "You are not authorized" });

  const token = authorization.split(" ")[1];
  const decoded = jsonwebtoken.verify(token, process.env.PRIV_KEY);

  const thread = await Thread.findById(id);
  if (req.body.content == thread.content) {
    return res.status(400).json({ success: false, msg: "Content not changes" });
  }
  if (thread.userId != decoded.sub) {
    return res
      .status(401)
      .json({ success: false, msg: "You are not authorized" });
  }

  Thread.findByIdAndUpdate(id, {
    $set: {
      createdAt: Date.now(),
      content: req.body.content,
    },
  })
    .then(() => {
      return res
        .status(200)
        .json({ success: true, msg: "Thread updated successfully" });
    })
    .catch((err) => {
      console.log(err.message);
      return res
        .status(400)
        .json({ success: false, msg: "Cannot update thread by that id" });
    });
};

//delete a thread
export const deleteThread = async (req, res) => {
  const { id } = req.params;

  const { authorization } = req.headers;

  if (!authorization)
    return res
      .status(401)
      .json({ success: false, msg: "You are not authorized" });

  const token = authorization.split(" ")[1];
  const decoded = jsonwebtoken.verify(token, process.env.PRIV_KEY);

  const thread = await Thread.findById(id);

  if (!thread)
    return res
      .status(400)
      .json({ success: false, msg: "Cannot find thread by that id" });
  if (thread.userId != decoded.sub) {
    return res
      .status(401)
      .json({ success: false, msg: "You cannot delete this thread" });
  } else {
    await Thread.findByIdAndDelete(id);
    return res.status(200).json({ success: true, msg: "Thread deleted" });
  }
};
