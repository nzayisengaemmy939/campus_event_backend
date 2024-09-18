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



export default eventRouter