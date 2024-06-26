import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/userRoute.js";
import gameRouter from "./routes/gameRoute.js";
import { connectDb } from "./db/config.js";
import { fileURLToPath } from 'url';
import path from "path"

dotenv.config();
// dotenv

const app = express();
const port = process.env.PORT || 8000;

// cors origin
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
  // all origins are allowed
);

app.use(express.json({ limit: "16kb" })); // json body
app.use(express.urlencoded({ extended: true })); // to decode the url special character

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'dist')));
console.log(",jaldf",__filename);

// routes
app.get("/", (req, res) => {
  res.status(200).json("Home Route");
});
app.use("/api/v1/user", userRouter);
app.use("/api/v1/game", gameRouter);

// error handling


connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log("server Started", port);
    });
  })
  .catch((err) => {
    console.log("Server unable to connect with Db");
  });
