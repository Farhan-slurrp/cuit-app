import express from "express";
import {
  addComment,
  deleteComment,
  editComment,
} from "../controllers/commentsController.js";

const router = express.Router();

router
  .route("/:threadId")
  .post(addComment)
  .put(editComment)
  .delete(deleteComment);

export default router;
