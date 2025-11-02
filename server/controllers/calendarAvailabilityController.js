// server/controllers/calendarAvailabilityController.js

// Returns N days of "All day" availability starting from today (or startDate).
// Excludes any date that already has an event in the events collection.
// Query params:
//   - days (number) default 30, clamped 1..365
//   - startDate (YYYY-MM-DD) optional

const Event = require('../models/Event');

function pad2(n) {
  return n < 10 ? '0' + n : String(n);
}

function formatDateYMDUTC(date) {
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
}

function addDaysUTC(date, days) {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function parseDateOnlyToUTC(dateStr) {
  const parts = (dateStr || '').split('-').map(Number);
  if (parts.length === 3 && Number.isInteger(parts[0]) && Number.isInteger(parts[1]) && Number.isInteger(parts[2])) {
    return new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  }
  return null;
}

async function getAvailability(req, res) {
  try {
    const days = Math.max(1, Math.min(365, Number(req.query.days) || 30));
    const startDateQuery = req.query.startDate;
    const startDateParsed = startDateQuery ? parseDateOnlyToUTC(startDateQuery) : null;
    const todayUTC = startDateParsed || new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()));

    // Build list of candidate dates (YYYY-MM-DD)
    const candidateDates = [];
    for (let i = 0; i < days; i++) {
      const d = addDaysUTC(todayUTC, i);
      candidateDates.push(formatDateYMDUTC(d));
    }

    // Query events that fall on any of these dates
    // Event.date stored as YYYY-MM-DD strings (per Event model),
    // adjust query if your Event.date is stored differently.
    const events = await Event.find({ date: { $in: candidateDates } }).select('date time').lean();

    // Build a Set of dates to exclude: if any event exists for a date, exclude that date.
    const excludedDates = new Set(events.map(ev => String(ev.date)));

    // Build availability items: include only dates not in excludedDates
    const items = candidateDates
      .filter(dateStr => !excludedDates.has(dateStr))
      .map(dateStr => ({
        id: `all-day-${dateStr}`,
        date: dateStr,
        time: 'All day',
        available: true,
      }));

    return res.json(items);
  } catch (err) {
    console.error('getAvailability error', err);
    return res.status(500).json({ error: 'Failed to fetch availability' });
  }
}

module.exports = { getAvailability };