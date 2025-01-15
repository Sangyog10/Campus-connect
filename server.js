import express from "express";
import "dotenv/config";
import cors from "cors";
import "express-async-errors";

import connectDB from "./db/connect.js";

import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

const app = express();

app.use(cors());

app.get("/test", (req, res) => {
  res.json({ msg: "test" });
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.DATABASE_URL);
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};
start();
