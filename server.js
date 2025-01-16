import express from "express";
import "dotenv/config";
import cors from "cors";
import "express-async-errors";

import { connectDb } from "./db/connect.js";

import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

import authRouter from "./route/authRoute.js";

const app = express();
app.use(express.json());

app.use(cors());

app.use("/api/v1/auth", authRouter);

app.get("/", (req, res) => {
  res.json({
    msg: "Welcome to campus-connect server where you cannot connect with others ",
  });
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDb(process.env.DATABASE_URL);
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};
start();
