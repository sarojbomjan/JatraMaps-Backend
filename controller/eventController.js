const Event = require('../models/eventmodel');
const fs = require('fs');
const path = require('path');

// Create event
const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, category, organizer, price, status } = req.body;
    
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    let imageData = null;

    if (req.file) {
      imageData = {
        path: `assets/events/${req.file.filename}`,
        url: `${baseUrl}/assets/events/${req.file.filename}`
      };
    }

    const newEvent = new Event({
      title,
      description,
      date,
      time,
      location,
      category,
      image: imageData,
      organizer,
      price,
      status,
      attendees: 0,
      createdAt: new Date()
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error('Error saving event: ', error);
    res.status(500).json({ error: "Failed to create event" });
  }
};

// Get upcoming events
const getUpcomingEvents = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await Event.find({
      date: { $gte: today.toISOString().split('T')[0] }
    }).sort({ date: 1 });

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching upcoming events: ", error);
    res.status(500).json({ error: "Failed to fetch upcoming events" });
  }
};

// Get past events
const getPastEvents = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await Event.find({
      date: { $lt: today.toISOString().split('T')[0] }
    }).sort({ date: -1 });
    
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching past events", error);
    res.status(500).json({ error: "Failed to fetch past events" });
  }
};

// Get all events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events: ", error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

// Get single event
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error('Error fetching event: ', error);
    res.status(500).json({ error: "Failed to fetch event" });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const { title, description, date, time, location, category, organizer, price, status } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // If new image is uploaded, delete old one
    if (req.file) {
      if (event.image) {
        try {
          fs.unlinkSync(event.image);
        } catch (err) {
          console.error('Error deleting old image:', err);
        }
      }
      event.image = req.file.path;
    }

    // Update other fields
    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.time = time || event.time;
    event.location = location || event.location;
    event.category = category || event.category;
    event.organizer = organizer || event.organizer;
    event.price = price || event.price;
    event.status = status || event.status;

    const updatedEvent = await event.save();
    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error('Error updating event: ', error);
    res.status(500).json({ error: "Failed to update event" });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid event ID" });
    }

    const event = await Event.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (event.image && fs.existsSync(event.image)) {
      fs.unlink(event.image, (err) => {
        if (err) console.error('Image cleanup error:', err);
      });
    }

    res.status(200).json({ 
      message: "Event deleted successfully",
      deletedId: event._id
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      error: "Internal server error",
      message: error.message
    });
  }
};

module.exports = {
  createEvent,
  getUpcomingEvents,
  getPastEvents,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};