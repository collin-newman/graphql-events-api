const mongoose = require('mongoose');
const db = require('./index');

const eventSchema = new mongoose.Schema({
  appId: { type: String, required: true },
  stageId: { type: String, required: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  startsAt: { type: Number, required: true },
  endsAt: { type: Number, required: true },
});

const Event = mongoose.model('Event', eventSchema);

const getEvents = async (dates = null) => {
  try {
    if (!dates) {
      const matchingEvents = Event.find();
      return matchingEvents;
    }
    const dateRange = {
      startsAt: { $gte: new Date(dates[0]).getTime() },
      endsAt: { $lte: new Date(dates[1]).getTime() },
    };
    const eventsInDateRange = Event.find(dateRange);
    return eventsInDateRange;
  } catch (error) {
    console.log(error);
    return [];
  }
}

const getEventById = async (id) => {
  try {
    const event = await Event.findById(id);
    return event;
  } catch (error) {
    console.log('hello eorror', error);
    return {};
  }
};

const getEventByName = async (name) => {
  try {
    const event = await Event.findOne({ name, }).exec();
    return event;
  } catch (error) {
    console.log(error);
    return {};
  }
}

const addEvent = async (event) => {
  const newEvent = new Event(event);
  try {
    const savedEvent = await newEvent.save();
    return savedEvent;
  } catch (error) {
    console.log(error);
    return {};
  }
};

const editEvent = async (id, event) => {
  try {
    const options = {
      upsert: true,
      new: true,
    };
    const updatedEvent = await Event.findOneAndUpdate({ _id: id }, event, options);
    return updatedEvent;
  } catch (error) {
    console.log(error);
    return {};
  }
};

const getEventsInApp = async (appId) => {
  try {
    const eventsInApp = await Event.find({ appId, });
    return eventsInApp;
  } catch (error) {
    console.log(error);
    return [];
  }
};


module.exports = {
  getEvents,
  getEventById,
  addEvent,
  getEventByName,
  editEvent,
  getEventsInApp,
};