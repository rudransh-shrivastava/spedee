import express, { Request, Response } from "express";
import path from "path";

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const app = express();
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

const PORT = process.env.PORT || 3001;

app.get("/", (_, res: Response) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.get("/api/v1/", (_, res) => {
  res.json({ message: "hii" });
});

app.listen(PORT, () => {
  return console.log(`⭐ Server is listening at http://localhost:${PORT} 🚀`);
});
