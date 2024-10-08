import express from "express";
import getNotification from "../controller/notController.js";
import checkMiddleware from "../middleware/middleware.js";

const notRouter = express.Router();

// Ensure getNotifications is a method in the getNotification object
notRouter.get('/notification', checkMiddleware.authenticateToken, getNotification.getNotifications);
notRouter.delete('/delete/:id', checkMiddleware.authenticateToken, getNotification.deleteNotifications);


export default notRouter;
