import express from "express";
import {
  addThread,
  deleteThread,
  getAllThreads,
  getSingleThread,
  getUserThreads,
  updateThread,
} from "../controllers/threadsController.js";
const router = express.Router();

router.route("/").get(getAllThreads).post(addThread);

router.route("/user/:id").get(getUserThreads);

router
  .route("/:id")
  .get(getSingleThread)
  .put(updateThread)
  .delete(deleteThread);

export default router;
