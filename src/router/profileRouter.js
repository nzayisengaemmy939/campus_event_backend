import express from "express";
import authenticateToken from "../middleware/middleware.js";
import multer from "multer";
import ProfileController from "../controller/profileController.js";

const profileRouter = express.Router();

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

profileRouter.post(
  "/profile_image",
  authenticateToken,
  upload.single("file"), // Ensure file is uploaded before processing
  ProfileController.registerProfile
);
profileRouter.get(
  "/get_profiles",// Ensure file is uploaded before processing
  ProfileController.getAllProfiles
);
profileRouter.put(
  "/edit_profile/:id",// Ensure file is uploaded before processing
  ProfileController.editProfile
);

export default profileRouter;
