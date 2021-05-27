import mongoose from "mongoose";

const ThreadSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  createdAt: Date,
  content: String,
});

const ThreadModel = mongoose.model("Thread", ThreadSchema, "threads");
