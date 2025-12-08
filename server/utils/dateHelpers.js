// small helpers to normalize start/end (UTC midnight) and calculate nights
exports.toUTCDate = dt => {
  const d = new Date(dt);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
};

exports.nightsBetween = (start, end) => {
  const s = exports.toUTCDate(start);
  const e = exports.toUTCDate(end);
  return Math.ceil((e - s) / (1000 * 60 * 60 * 24));
};