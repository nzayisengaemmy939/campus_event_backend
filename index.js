import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from 'swagger-ui-express';
import connectDB from './src/database/database.js';
import userRoute from './src/router/userRoute.js';
import eventRouter from './src/router/eventRouter.js';
import profileRouter from './src/router/profileRouter.js';
// import webpush from "web-push"
import notRouter from './src/router/notifRouter.js';
// import subRoute from './src/router/subRoute.js';

dotenv.config();
const app = express();

// const vapidKeys=webpush.generateVAPIDKeys();
// console.log(vapidKeys)
// webpush.setVapidDetails(
//   'mailto:nzayisengaemmy2001@gmail.com',
//   vapidKeys.publicKey,
//   vapidKeys.privateKey
// );
app.use(cors());
app.use(express.json()); // Use express.json() instead of bodyParser.json()

connectDB()

app.get("/", (req, res) => {
  res.status(200).send("Welcome to my API");
});
app.use("/users", userRoute)
app.use('/events',eventRouter)
app.use('/profiles',profileRouter)
app.use("/notifications",notRouter)
app.get("*", (req, res) => {
  res.status(404).send("Page is not found");
});

const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
