import { connectDb } from "./db/connect.js";
import app from "./app.js";

const port = process.env.PORT || 8080;
const start = async () => {
  try {
    await connectDb(process.env.DATABASE_URL);
    app.listen(port, () => console.log(`Server is running on port:${port}`));
  } catch (error) {
    console.log(error);
  }
};
start();

export default app;
