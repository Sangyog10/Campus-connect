import express from "express";
import "dotenv/config";
import cors from "cors";
import "express-async-errors";

import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

import authRouter from "./route/authRoute.js";
import userRouter from "./route/userRoute.js";
import attendenceRouter from "./route/attendenceRoute.js";
import noticeRouter from "./route/noticeRoute.js";
import marksRouter from "./route/marksRoute.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/details", userRouter);
app.use("/api/v1/attendence", attendenceRouter);
app.use("/api/v1/notice", noticeRouter);
app.use("/api/v1/marks", marksRouter);

app.get("/", (req, res) => {
  res.json({
    msg: "Welcome to campus-connect server where you cannot connect with others ",
  });
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;
