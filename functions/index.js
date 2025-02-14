import express from "express";
import bodyParser from 'body-parser';
import cors from 'cors';
import { https } from "firebase-functions";
import signup from "./routes/signup.js";
import login from "./routes/login.js"
import upload from "./routes/upload.js"
import fetchVideos from "./routes/fetchVideos.js"
import updateProfile from "./routes/updateProfile.js"
import userProfile from "./routes/userProfile.js"
const app = express();
const PORT = process.env.PORT || 8080;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


app.use(signup)
app.use(login)
app.use(upload)
app.use(fetchVideos)
app.use(updateProfile)
app.use(userProfile)
app.get("/ready", async (req, res) => {
  res.status(200).json("Server is ready");
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
