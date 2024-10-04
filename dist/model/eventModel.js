import mongoose from "mongoose";
const { Schema } = mongoose;

const eventsSchema = new Schema({
  owner: {
    type: String,
    required: true,
  },
name:{
  type: String,
  // required: true,
},
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },
  status:{
    type:String,
default:"comming"
  },
  time: {
    type: String,
    required: true,
  },
  locationLink: {
    type: String,
    // required: true,
  },
  locationName: {
    type: "String",
    required: true,
  },
  category: {
    type: "String",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  attendes: {
    type: [String],
    default: [],
  },
  likes: {
    type: [String],
    default: [],
  },
  dislikes: {
    type: [String],
    default: [],
  },
  accept: {
    type: [String],
    default: [],
  },
  viewedBy:{
    type: [String],
    default: [],
  },
  decline: {
    type: [String],
    default: [],
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Events = mongoose.model("events", eventsSchema);

export default Events;
