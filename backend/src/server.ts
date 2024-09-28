import express, { Request, Response } from "express";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();

const PORT = process.env.PORT || 3001;

app.get("/api/v1/", (_, res) => {
  res.json({ message: "hii" });
});

app.listen(PORT, () => {
  return console.log(`⭐ Server is listening at http://localhost:${PORT} 🚀`);
});
