import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import connectDB from './src/database/database.js';
import userRoute from './src/router/userRoute.js';
import eventRouter from './src/router/eventRouter.js';

dotenv.config();
const app = express();


app.use(cors());
app.use(express.json()); // Use express.json() instead of bodyParser.json()

connectDB()

app.get("/", (req, res) => {
  res.status(200).send("Welcome to my API");
});
app.use("/users", userRoute)
app.use('/events',eventRouter)

app.get("*", (req, res) => {
  res.status(404).send("Page is not found");
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
