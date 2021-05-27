import express from "express";
import cors from "cors";

import "./db/config.js";
import "./db/models/users.js";
import "./db/models/thread.js";
import "./db/models/comment.js";

const app = express();
import UserRouter from "./routers/usersRouter.js";
import ThreadRouter from "./routers/threadsRouter.js";
import CommentRouter from "./routers/commentsRouter.js";

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/api/users", UserRouter);
app.use("/api/threads", ThreadRouter);
app.use("/api/comments", CommentRouter);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
