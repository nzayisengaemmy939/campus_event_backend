import Events from "../model/eventModel.js";
class EventsController {
    static async registerEvents(req, res) {
        try {
          const { title, description, date, time, locationLink, locationName } = req.body;
      
          // Basic validation
          if (!title || !description || !date || !time || !locationName) {
            return res.status(400).json({
              status: "error",
              message: "All fields are required except location link",
            });
          }
      
          // Get the user ID from the token
          const eventsOwner = req.user.userId;

          console.log(`from token ${eventsOwner}`)
      
          // Ensure the user ID is present
          if (!eventsOwner) {
            return res.status(401).json({ status: "error", message: "Unauthorized" });
          }
      
          // Create a new event with the owner's user ID
          const event = await Events.create({
            title,
            description,
            date,
            time,
            locationLink,
            locationName,
            owner: eventsOwner, // Use the field name you defined in your schema
          });
      
          console.log("Event saved:", event);
      
          return res.status(201).json({
            status: "success",
            message: "Event registered successfully",
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
}
export default EventsController;
