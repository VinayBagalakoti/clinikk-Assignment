import express from "express";
import bodyParser from 'body-parser';
import cors from 'cors';
import { https } from "firebase-functions";
import signup from "./routes/signup.js";
const app = express();
const PORT = process.env.PORT || 8080;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


app.use(signup)


app.get("/ready", async (req, res) => {
  res.status(200).json("Server is ready");
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
