const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, required: true },
  image: { 
    path: { type: String },       // e.g. "assets/events/filename.jpg"
    url: { type: String }         // e.g. "http://yourdomain.com/assets/events/filename.jpg"
  },
  organizer: { type: String, required: true },
  price: { type: String, default: 'Free' },
  status: { type: String, default: 'draft' },
  attendees: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, {
  toJSON: { virtuals: true },     // Ensure virtuals are included when converted to JSON
  toObject: { virtuals: true }    // Include virtuals when converting to objects
});

module.exports = mongoose.model('Event', eventSchema);