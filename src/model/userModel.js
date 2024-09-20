import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

  // Add subscription field for push notifications
  // subscription: {
  //   endpoint: { type: String },   // URL where the push message will be sent
  //   keys: {
  //     p256dh: { type: String },   // Public encryption key
  //     auth: { type: String },     // Authentication key
  //   },
  // },

  resetToken: String,
  resetTokenExpiration: Date
});

const User = mongoose.model("users", userSchema);

export default User;
