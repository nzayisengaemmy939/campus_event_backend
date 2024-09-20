import express from "express";
import EventsController from "../controller/eventController.js";
import checkMiddleware from "../middleware/middleware.js";

const eventRouter = express.Router();

eventRouter.post(
  "/register",
  checkMiddleware.authenticateToken,
  EventsController.registerEvents
);

eventRouter.get("/get_event/:id", EventsController.getEvent);

eventRouter.get(
  "/owner_event/:owner",
  checkMiddleware.authenticateToken, // Authenticate first
  checkMiddleware.checkClientAndAdmin, // Then check role
  EventsController.ownerEvent
);

eventRouter.get(
  "/get_events",
  checkMiddleware.authenticateToken, // Authenticate first
  checkMiddleware.checkClientAndAdmin, // Then check role
  EventsController.getEvents
);

eventRouter.delete(
  "/delete_event/:id",
  checkMiddleware.authenticateToken, // Authenticate first
  checkMiddleware.checkClientAndAdmin, // Then check role
  EventsController.deleteEvent
);

eventRouter.patch(
  "/update_event/:id",
  checkMiddleware.authenticateToken, // Authenticate first
  checkMiddleware.checkClientAndAdmin, // Then check role
  EventsController.updateSingleEvent
);

eventRouter.post(
  "/attend_events/:id",
  checkMiddleware.authenticateToken,
  EventsController.attendEvent
);

eventRouter.post(
  "/likes/:id",
  checkMiddleware.authenticateToken,
  EventsController.getLikes
);

eventRouter.post(
  "/dislikes/:id",
  checkMiddleware.authenticateToken,
  EventsController.getDislikes
);

eventRouter.post(
  "/accept/:id",
  checkMiddleware.authenticateToken,
  EventsController.acceptEvents
);

eventRouter.post(
  "/decline/:id",
  checkMiddleware.authenticateToken,
  EventsController.declineEvents
);

eventRouter.post(
  "/viewed/:id",
  checkMiddleware.authenticateToken,
  EventsController.markAsViewed,
  checkMiddleware.checkClientAndAdmin // Check role last
);

eventRouter.post(
  "/status/:id",
  checkMiddleware.authenticateToken, // Authenticate first
  checkMiddleware.checkClientAndAdmin, // Then check role
  EventsController.getEventsWithStatus
);

export default eventRouter;
