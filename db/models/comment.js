import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  threadId: String,
  createdAt: Date,
  content: String,
});

const CommentModel = mongoose.model("Comment", CommentSchema, "comments");
