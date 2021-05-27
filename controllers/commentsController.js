import mongoose from "mongoose";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const User = mongoose.model("User");
const Thread = mongoose.model("Thread");
const Comment = mongoose.model("Comment");

//add new comment
export const addComment = async (req, res) => {
  const { threadId } = req.params;
  const { authorization } = req.headers;

  if (!authorization)
    return res
      .status(401)
      .json({ success: false, msg: "You are not authorized" });

  const token = authorization.split(" ")[1];
  const decoded = jsonwebtoken.verify(token, process.env.PRIV_KEY);

  const thread = await Thread.findById(threadId);
  const user = await User.findOne({ _id: decoded.sub });

  if (!thread)
    return res
      .status(400)
      .json({ success: false, msg: "Cannot find thread by that id" });
  if (!req.body.content)
    return res
      .status(400)
      .json({ success: false, msg: "Cannot add comment of blank" });

  try {
    const newComment = new Comment({
      userId: decoded.sub,
      userName: user.username,
      threadId,
      createdAt: Date.now(),
      content: req.body.content,
    });

    await newComment.save();
    return res.status(200).json({ success: true, msg: "Comment added" });
  } catch (err) {
    console.log(err.message);
    return res
      .status(400)
      .json({ success: true, msg: "Cannot add comment of undefined" });
  }
};

//update a comment
export const editComment = async (req, res) => {
  const { threadId } = req.params;
  const { authorization } = req.headers;
  const { commentId } = req.query;

  if (!authorization)
    return res
      .status(401)
      .json({ success: false, msg: "You are not authorized" });

  const token = authorization.split(" ")[1];
  const decoded = jsonwebtoken.verify(token, process.env.PRIV_KEY);

  try {
    await Thread.findById(threadId);
  } catch (err) {
    console.log(err.message);
    return res.json({ success: false, msg: "Cannot find thread by that id" });
  }

  if (!req.body.content || !req.query.commentId)
    return res.json({ success: false, msg: "Cannot edit comment" });

  try {
    const comment = await Comment.findById(commentId);

    if (comment.userId != decoded.sub) throw new Error(`Incorrect user`);
    if (comment.content == req.body.content)
      return res.json({ success: false, msg: "Comment not changes" });

    await Comment.findByIdAndUpdate(commentId, {
      $set: {
        userId: decoded.sub,
        threadId,
        createdAt: Date.now(),
        content: req.body.content,
      },
    });
    return res.status(200).json({ success: true, msg: "Comment added" });
  } catch (err) {
    console.log(err.message);
    return res.json({ success: true, msg: "Cannot add comment" });
  }
};

//delete a comment
export const deleteComment = async (req, res) => {
  const { threadId } = req.params;
  const { authorization } = req.headers;
  const { commentId } = req.query;

  if (!authorization)
    return res.json({ success: false, msg: "You are not authorized" });

  const token = authorization.split(" ")[1];
  const decoded = jsonwebtoken.verify(token, process.env.PRIV_KEY);

  try {
    await Thread.findById(threadId);
  } catch (err) {
    console.log(err.message);
    return res.json({ success: false, msg: "Cannot find thread by that id" });
  }

  if (!req.query.commentId)
    return res.json({
      success: false,
      msg: "Cannot delete comment of undefined",
    });

  try {
    const comment = await Comment.findById(commentId);

    if (comment.userId != decoded.sub) throw new Error(`Incorrect user`);

    await Comment.findByIdAndDelete(commentId);
    return res.status(200).json({ success: true, msg: "Comment deleted" });
  } catch (err) {
    console.log(err.message);
    return res.json({ success: true, msg: "Cannot delete comment by that id" });
  }
};
