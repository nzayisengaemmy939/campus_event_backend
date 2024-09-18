import express from "express"
import EventsController from "../controller/eventController.js"
import authenticateToken from "../middleware/middleware.js"
const  eventRouter=express.Router();
eventRouter.post('/register',authenticateToken,EventsController.registerEvents)
eventRouter.get('/get_event/:id',EventsController.getEvent)
eventRouter.get('/owner_event/:owner',EventsController.ownerEvent)
eventRouter.get('/get_events',EventsController.getEvents)
eventRouter.delete('/delete_event/:id',EventsController.deleteEvent)
eventRouter.patch('/update_event/:id',EventsController.updateSingleEvent)
eventRouter.post('/attend_events/:id',authenticateToken,EventsController.attendEvent)
eventRouter.post('/likes/:id',authenticateToken,EventsController.getLikes)
eventRouter.post('/dislikes/:id',authenticateToken,EventsController.getDislikes)





export default eventRouter