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
  static async deleteNotifications(req, res) {
    try {
      // Get the logged-in user's ID (if needed)
      
      // Fetch the notification for the given ID
      const notification = await Notification.findOne({ _id: req.params.id });
  
      // Check if the notification exists
      if (!notification) {
        return res.status(404).json({
          status: "failed",
          message: "Notification not found",
        });
      }
  
      // Delete the notification
      await Notification.deleteOne({ _id: req.params.id });
  
      return res.status(200).json({
        status: "success",
        message: "Notification deleted successfully",
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
  