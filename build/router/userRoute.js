import express from "express";
import UserController from "../controller/userController.js";
import checkMiddleware from "../middleware/middleware.js";

const userRoute = express.Router();

userRoute.post("/register", UserController.registerUser);
userRoute.post("/login", UserController.loginUser);
userRoute.get(
  "/getusers",
  checkMiddleware.authenticateToken,
  checkMiddleware.checkAdminRole,
  UserController.getUsers
);
userRoute.delete(
  "/delete/:id",
  checkMiddleware.authenticateToken,
  checkMiddleware.checkAdminRole,
  UserController.deleteUser
);
userRoute.get("/getuser/:id", UserController.getSingleUser);
userRoute.put("/updateuser/:id", UserController.updateSingleUser);
// userRoute.post("/reset", UserController.resetPassword);
// userRoute.post(
//     "/reset/:token",
//   );

export default userRoute;
