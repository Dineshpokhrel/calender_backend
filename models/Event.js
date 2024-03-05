// // models/Event.js

// import mongoose from 'mongoose';

// const eventSchema = new mongoose.Schema({
//   // Define event schema
// });

// const Event = mongoose.model('Event', eventSchema);

// export default Event;

// event.model.js

import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  summary: { type: String, required: true },
  description: String,
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  location: String,
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
