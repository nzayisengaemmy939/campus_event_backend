import Events from "../model/eventModel.js";
import User from "../model/userModel.js";
// import getEventStatus from "../status/status.js";
import Notification from "../model/notificationModel.js"
import EventStatus from "../status/status.js";
import webpush from "web-push";
class EventsController {
  static async registerEvents(req, res) {
    try {
      const { title, description, date, time, locationLink, locationName } =
        req.body;

      // Basic validation
      if (!title || !description || !date || !time || !locationName) {
        return res.status(400).json({
          status: "error",
          message: "All fields are required except location link",
        });
      }

      const eventsOwner = req.user.userId;

      // Ensure the user ID is present
      if (!eventsOwner) {
        return res
          .status(401)
          .json({ status: "error", message: "Unauthorized" });
      }

      // Create a new event with the owner's user ID
      const event = await Events.create({
        title,
        description,
        date,
        time,
        locationLink,
        locationName,
        owner: eventsOwner,
      });

      console.log("Event saved:", event);

      // Fetch all users
      const users = await User.find();

      // Prepare and save notifications for each user
      const notificationPromises = users.map(async (user) => {
        const notification = new Notification({
          userId: user._id,
          owner:req.user.userId,
          title: req.user.firstName,
          message: `added new event ${event.title}`,
        });

        // Save the notification to the database
        await notification.save();
      });

      await Promise.all(notificationPromises); // Wait for all notifications to be saved

      return res.status(201).json({
        status: "success",
        message:
          "Event registered successfully, notifications stored in the app.",
        event,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: "Server error",
      });
    }
  }

  static async getEvent(req, res) {
    try {
      const event = await Events.findOne({ _id: req.params.id });
      if (!event) {
        return res
          .status(400)
          .json({ message: "ivent data", status: "failure" });
      }
      return res
        .status(200)
        .json({ status: "success", message: "your data is this", data: event });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: "failed to acess to db",
      });
    }
  }
  static async deleteEvent(req, res) {
    try {
      const event = await Events.findOne({ _id: req.params.id });
      if (!event) {
        return res
          .status(400)
          .json({ message: "no ivent to delete", status: "failure" });
      }
      return res.status(200).json({
        status: "success",
        message: "your data to delete is this",
        data: event,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: "failed to acess to db",
      });
    }
  }
  static async getEvents(req, res) {
    try {
      const events = await Events.find();
      if (!events.length) {
        return res
          .status(400)
          .json({ message: "ivent data", status: "failure" });
      }
      return res.status(200).json({
        status: "success",
        message: "your data is this",
        data: events,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: "failed to acess to db",
      });
    }
  }
  static async updateSingleEvent(req, res) {
    try {
      const { title, description, date, time, locationLink, locationName } =
        req.body;

      // Find the event by ID
      const event = await Events.findOne({ _id: req.params.id });

      if (!event) {
        return res.status(404).json({
          status: "fail",
          message: "Event not found",
        });
      }

      // Update event details
      if (title) {
        event.title = title;
      }
      if (description) {
        event.description = description;
      }
      if (date) {
        event.date = date;
      }
      if (time) {
        event.time = time;
      }
      if (locationLink) {
        event.locationLink = locationLink;
      }
      if (locationName) {
        event.locationName = locationName;
      }

      event.updatedAt = new Date(); // Update the `updatedAt` timestamp

      // Save the updated event
      await event.save();

      return res.status(200).json({
        status: "success",
        message: "Event updated successfully",
        data: event,
      });
    } catch (error) {
      return res.status(500).json({
        status: "internal server error",
        error: error.message,
      });
    }
  }
  static async ownerEvent(req, res) {
    try {
      const event = await Events.findOne({ owner: req.params.owner });
      if (!event) {
        return res
          .status(400)
          .json({ message: "no data found", status: "failure" });
      }
      return res
        .status(200)
        .json({ status: "success", message: "owner events", data: event });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: "failed to acess to db",
      });
    }
  }
  static async attendEvent(req, res) {
    try {
      const userId = req.user.userId;
      // assuming the eventId is passed in the request parameters

      if (!userId) {
        return res
          .status(400)
          .json({ message: "You are not authenticated", status: "failure" });
      }

      // Find the event by ID

      const event = await Events.findOne({ _id: req.params.id });
      if (!event) {
        console.log(`Event not found for ID: ${req.params.id}`);
        return res
          .status(404)
          .json({ message: "Event not found", status: "failure" });
      }

      // Check if the user is already in the attendee list
      if (event.attendes.includes(userId)) {
        return res.status(400).json({
          message: "You are already attending this event",
          status: "failure",
        });
      }

      // Add the user to the attendees list
      event.attendes.push(userId);
      await event.save({ validateBeforeSave: false });

      return res.status(200).json({
        status: "success",
        message: "You are now attending the event",
        data: event.attendes,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: "Failed to access the database",
      });
    }
  }
  static async getLikes(req, res) {
    try {
      const userId = req.user.userId;

      if (!userId) {
        return res
          .status(400)
          .json({ message: "You are not authenticated", status: "failure" });
      }

      const event = await Events.findOne({ _id: req.params.id });
      if (!event) {
        console.log(`Event not found for ID: ${req.params.id}`);
        return res
          .status(404)
          .json({ message: "Event not found", status: "failure" });
      }

      // Check if the user is already in the attendee list
      if (event.likes.includes(userId)) {
        // Remove the user from the likes array if already liked
        event.likes.pull(userId);
      } else {
        // Add the user to the likes array
        event.likes.push(userId);
      }

      await event.save({ validateBeforeSave: false });

      return res.status(200).json({
        status: "success",
        message: "Now you liked events",
        data: event.likes,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: "Failed to access the database",
      });
    }
  }
  static async getDislikes(req, res) {
    try {
      const userId = req.user.userId;

      if (!userId) {
        return res
          .status(400)
          .json({ message: "You are not authenticated", status: "failure" });
      }

      const event = await Events.findOne({ _id: req.params.id });
      if (!event) {
        console.log(`Event not found for ID: ${req.params.id}`);
        return res
          .status(404)
          .json({ message: "Event not found", status: "failure" });
      }

      if (event.dislikes.includes(userId)) {
        event.dislikes.pull(userId);
      } else {
        event.dislikes.push(userId);
      }

      await event.save({ validateBeforeSave: false });

      return res.status(200).json({
        status: "success",
        message: "Now you disliked events",
        data: event.dislikes,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: "Failed to access the database",
      });
    }
  }
  static async acceptEvents(req, res) {
    try {
      const userId = req.user.userId;

      if (!userId) {
        return res
          .status(400)
          .json({ message: "You are not authenticated", status: "failure" });
      }

      const event = await Events.findOne({ _id: req.params.id });
      if (!event) {
        console.log(`Event not found for ID: ${req.params.id}`);
        return res
          .status(404)
          .json({ message: "Event not found", status: "failure" });
      }

      if (event.accept.includes(userId)) {
        event.accept.pull(userId);
      } else {
        event.accept.push(userId);
      }

      await event.save({ validateBeforeSave: false });

      return res.status(200).json({
        status: "success",
        message: "Now you accepted events",
        data: event.accept.length,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: "Failed to access the database",
      });
    }
  }
  static async declineEvents(req, res) {
    try {
      const userId = req.user.userId;

      if (!userId) {
        return res
          .status(400)
          .json({ message: "You are not authenticated", status: "failure" });
      }

      const event = await Events.findOne({ _id: req.params.id });
      if (!event) {
        console.log(`Event not found for ID: ${req.params.id}`);
        return res
          .status(404)
          .json({ message: "Event not found", status: "failure" });
      }

      if (event.decline.includes(userId)) {
        event.decline.pull(userId);
      } else {
        event.decline.push(userId);
      }

      await event.save({ validateBeforeSave: false });

      return res.status(200).json({
        status: "success",
        message: "Now you declined events",
        data: event.decline.length,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: "Failed to access the database",
      });
    }
  }
  static async markAsViewed(req, res) {
    try {
      const userId = req.user.userId;

      if (!userId) {
        return res
          .status(400)
          .json({ message: "You are not authenticated", status: "failure" });
      }

      // Find the event by ID
      const event = await Events.findOne({ _id: req.params.id });

      if (!event) {
        return res
          .status(404)
          .json({ message: "Event not found", status: "failure" });
      }

      // Check if the user has already viewed the event
      if (!event.viewedBy.includes(userId)) {
        // If not, mark it as viewed by adding their user ID to the array
        event.viewedBy.push(userId);
        await event.save();
      }

      return res.status(200).json({
        status: "success",
        message: "Event marked as viewed",
        data: event,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: "Failed to access the database",
      });
    }
  }

  static async getEventsWithStatus(req, res) {
    try {
      // Fetch the event by its ID
      const event = await Events.findById(req.params.id); // Use findById for single event

      if (!event) {
        return res.status(404).json({
          status: "failure",
          message: "Event not found",
        });
      }

      // Determine the status of the event
      const status = EventStatus.getEventStatus(event.date);

      return res.status(200).json({
        status: "success",
        message: "Event status fetched successfully",
        data: {
          event: {
            title: event.title,
            date: event.date,
            status: status,
          },
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: "Failed to access the database",
      });
    }
  }
}

export default EventsController;
