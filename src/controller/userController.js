import bcrypt from "bcrypt"; // Ensure you have bcrypt installed
import User from "../model/userModel.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import text  from "body-parser";

class UserController {
  static async registerUser(req, res) {
    try {
      const { userName, password, email, lastName, firstName } = req.body;

      // Basic validation
      if (!userName || !password || !email || !lastName || !firstName) {
        return res.status(400).json({
          status: "error",
          message: "All fields are required",
        });
      }
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          message: "Email already exist",
          status: "failure",
        });
      }
      // const token=jwt.sign({email,userName,lastName,firstName},process.env.JWT_SECRET,{expiresIn:"1d",})
      // console.log(token,"token to be send")
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user with hashed password
      const newUser = await User.create({
        userName,
        lastName,
        firstName,
        email,
        password:hashedPassword
      });

      console.log("User saved:", newUser);

      return res.status(201).json({
        status: "success",
        message: "User registered successfully",
        user: newUser,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: "Server error",
      });
    }
  }
  static async getUsers(req, res) {
    try {
      const allUsers = await User.find();
      return res.status(200).json({ data: allUsers, message: "All users" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Failed to access to db" });
    }
  }
  static async getSingleUser(req, res) {
    try {
      const singleUser = await User.findOne({ _id: req.params.id });
      if (!singleUser) {
        return res.status(400).json({
          status: "Fail",
          message: "user with that Id does not exist!",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "User Profile exist",
        data: singleUser,
      });
    } catch (error) {
      return res.status(500).json({
        status: "Fail",
        message: error.message,
      });
    }
  }
  static async deleteUser(req, res) {
    try {
      const deletedUser = await User.findOne({ _id: req.params.id });
      if (!deletedUser) {
        return res.status(400).json({
          status: "Fail",
          message: "user with that Id does not exist!",
        });
      }
      return res.status(200).json({
        status: "success",
        message: "User deleted successfully",
        data: deletedUser ,
      });
    } catch (error) {
      return res.status(500).json({
        status: "Fail",
        message: error.message,
      });
    }
  }
  static async updateSingleUser(req, res) {
    try {
      const {
        
        firstName,
        lastName,
      userName,
      } = req.body;
      const userFound = await User.findOne({ _id: req.params.id });
      if (firstName) {
        userFound.firstName = firstName;
      }
      if (lastName) {
        userFound.lastName =lastName;
      }
      if (userName) {
        userFound.userName =userName;
      }
     
      userFound.updatedAt = new Date();
      if (req.body.email) {
        return res.status(400).json({
          status: "bad request",
          message: "email can not be updated",
        });
      }
      await userFound.save();
      return res.status(200).json({
        status: "sucess",
        message: "profile updated successfully",
        data: userFound,
      });
    } catch (error) {
      return res.status(500).json({
        status: "internal server error",
        error: error.message,
      });
    }
  }
  // static async resetPassword(req, res) {
  //   try {
  //     const { email } = req.body;
  //     const findUser = await User.findOne({ email });
  //     if (!findUser) {
  //       return res.status(400).json({ message: "User not found" });
  //     }
  
  //     // Generate the reset token
  //     const token = jwt.sign({ userId: findUser._id }, process.env.JWT_SECRET, {
  //       expiresIn: "1h",
  //     });
  //     findUser.resetToken = token;
  //     findUser.resetTokenExpiration = Date.now() + 3600000; // 1 hour
  //     await findUser.save();
  
  //     // Configure the email transporter
  //     const transporter = nodemailer.createTransport({
  //       service: 'gmail',
  //       auth: {
  //         user: process.env.EMAIL_USERNAME,
  //         pass: process.env.EMAIL_PASSWORD,
  //       },
  //     });
  
  //     // Create the email content
  //     const mailOptions = {
  //       to: findUser.email,
  //       from: process.env.EMAIL_USERNAME,
  //       subject: "Password Reset Request",
  //       html: `<p>Hello ${findUser.firstName},</p>
  //              <p>We received a request to reset your password. Click the link below to set a new password:</p>
  //              <p>${token}</p>
  //              <p>If you did not request this, please ignore this email.</p>
  //              <p>Thank you,</p>
  //              <p>Your Company Name</p>`,
  //     };
  
  //     // Send the email
  //     transporter.sendMail(mailOptions, (err) => {
  //       // if (err) {
  //       //   console.error('Error sending email:', err);
  //       //   return res.status(500).json({
  //       //     status: "fail",
  //       //     message: "Failed to send reset email",
  //       //   });
  //       // }
  //       res.status(200).json({
  //         status: "success",
  //         message: "Reset email sent",
  //       });
  //     });
  
  //   } catch (error) {
  //     console.error('Error in resetPassword:', error);
  //     return res.status(500).json({ status: "error", message: error.message });
  //   }
  // }
  
  
  
  static async loginUser(req, res) {
    try {
      const { email, password } = req.body;
  
      // Find the user by email
      const userFound = await User.findOne({ email });
      if (!userFound) {
        return res.status(404).json({
          status: "fail",
          message: "Account does not exist",
        });
      }
  
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = await bcrypt.compare(password, userFound.password);
      console.log(isPasswordValid)
      if (!isPasswordValid) {
        return res.status(400).json({
          status: "fail",
          message: "Incorrect password",
        });
      }
  
      // Generate the JWT token
      const token = jwt.sign({
        userId: userFound._id,
        role: userFound.role,
        email: userFound.email,
        firstName: userFound.firstName,
      }, process.env.JWT_SECRET, { expiresIn: "1d" });
  
      // Return success response with the token and user info
      return res.status(200).json({
        status: "success",
        message: "Logged in successfully",
        token,
        role: userFound.role,
        user: {
          userId: userFound._id,
          role: userFound.role,
          email: userFound.email,
          firstName: userFound.firstName,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
  
}

export default UserController;
