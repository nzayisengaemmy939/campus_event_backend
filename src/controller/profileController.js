import Profile from "../model/profileModel.js";
import cloudinary from "../cloudinary/cloudinary.js";

class ProfileController {
  static async registerProfile(req, res) {
    try {
      // Ensure the user is authenticated and the email is attached to req.user
      const  owner = req.user.userId;
      if (! owner) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // Validate file presence
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Determine the resource type based on MIME type
      let resourceType = "image";
      if (
        req.file.mimetype !== "image/jpeg" &&
        req.file.mimetype !== "image/png" &&
        req.file.mimetype !== "image/gif"
      ) {
        resourceType = "raw";
      }

      // Upload file to Cloudinary
      cloudinary.uploader.upload(
        req.file.path,
        {
          resource_type: resourceType,
        },
        async (err, result) => {
          if (err) {
            console.error("Error uploading file:", err);
            return res.status(500).json({ success: false, message: "File upload error" });
          }

          console.log("File uploaded successfully:", result);

          // Save profile details in the database
          const registeredProfile = await Profile.create({
            file: result.secure_url, // Use the Cloudinary URL
            owner:  owner,
          });

          return res.status(200).json({
            data: registeredProfile,
            message: "Profile registered successfully",
          });
        }
      );
    } catch (error) {
      console.error("Error registering profile:", error);
      res.status(500).json({ error: "Failed to register profile" });
    }


    }
    static async getAllProfiles(req,res){
      try {
       const allProfiles=await Profile.find()
       return res.status(200).json({
        status:"success",
        message:"all profiles",
        data:allProfiles
       }) 
      } catch (error) {
        console.error("Error registering profile:", error);
        res.status(500).json({ error: "Failed to get all profile" });
      }
  }
  static async editProfile(req, res) {
    try {
      const { file } = req.body;
      const edit = await Profile.findOne({ _id: req.params.id });
      
      if (!edit) {
        return res.status(404).json({ error: "Profile not found" });
      }
  
      if (file) {
        edit.file = file;
      }
  
      await edit.save();
      return res.status(200).json({
        status: "success",
        message: "Profile updated successfully",
        data: edit,
      });
    } catch (error) {
      console.error("Error editing profile:", error);
      res.status(500).json({ error: "Failed to edit profile" });
    }
  }
  
}

export default ProfileController;
