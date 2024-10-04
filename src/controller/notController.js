import Notification from "../model/notificationModel.js";

class getNotification{

static async getNotifications(req, res) {
    try {
      const userId = req.user.userId; // Get the logged-in user's ID
  
      // Fetch notifications for the user
      const notifications = await Notification.find({ userId }).sort({ createdAt: 1 });
  
      return res.status(200).json({
        status: "success",
        notifications,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: "Server error",
      });
    }
  }
}
export default getNotification
  