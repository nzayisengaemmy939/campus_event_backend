import express from "express";
import UserController from "../controller/userController.js";

const userRoute = express.Router();

userRoute.post("/register", UserController.registerUser);
userRoute.post("/login", UserController.loginUser);
userRoute.get("/getusers", UserController.getUsers);
userRoute.get("/getuser/:id", UserController.getSingleUser);
userRoute.put("/updateuser/:id", UserController.updateSingleUser);
// userRoute.post("/reset", UserController.resetPassword);
// userRoute.post(
//     "/reset/:token",
//   );




export default userRoute;
