import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({ msg: "ram chnaderyyy" });
});

app.listen(3000, () => {
  console.log("server started");
});
