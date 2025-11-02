// server/controllers/calendarController.js

const Event = require('../models/Event');

module.exports = (io) => {
  // safe io: avoid throws if io is not provided
  const safeIo = (io && typeof io.emit === 'function') ? io : { emit: () => {} };

  return {
    async createEvent(req, res) {
      try {
        const { title, date, time, userId, createdByAdmin = true } = req.body;
        if (!title || !date || !time || (userId === undefined || userId === null)) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const event = await Event.create({ title, date, time, userId, createdByAdmin });
        // broadcast an update
        safeIo.emit('calendarUpdate', event);
        return res.status(201).json(event);
      } catch (err) {
        console.error('Create event error:', err);
        return res.status(500).json({ error: err.message });
      }
    },

    async getEvents(req, res) {
      try {
        // sort by date then time; store date/time as strings so sorting is lexicographic for ISO dates
        const events = await Event.find().sort({ date: 1, time: 1 }).lean();
        return res.json(events);
      } catch (err) {
        console.error('Get events error:', err);
        return res.status(500).json({ error: err.message });
      }
    },

    async updateEvent(req, res) {
      try {
        const { id } = req.params;
        const { title, date, time, userId } = req.body;

        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        event.title = title ?? event.title;
        event.date = date ?? event.date;
        event.time = time ?? event.time;
        event.userId = (userId === undefined) ? event.userId : userId;

        await event.save();
        safeIo.emit('calendarUpdate', event);
        return res.json(event);
      } catch (err) {
        console.error('Update event error:', err);
        return res.status(500).json({ error: err.message });
      }
    },

    async deleteEvent(req, res) {
      try {
        const { id } = req.params;
        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ error: 'Event not found' });

        await event.remove();
        safeIo.emit('calendarDelete', id);
        return res.json({ success: true, id });
      } catch (err) {
        console.error('Delete event error:', err);
        return res.status(500).json({ error: err.message });
      }
    },
  };
};