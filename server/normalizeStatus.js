// normalizeStatus.js
const CANONICAL_STATUSES = {
  AUTOMATICALLY_UPGRADED: 'automatically upgraded',
  PENDING: 'pending',
  FAILED: 'failed',
  UNKNOWN: 'unknown'
};

const trailingPunctuationRegex = /[.,;:]+$/u;

function normalizeStatus(raw) {
  if (raw === null || raw === undefined) return CANONICAL_STATUSES.UNKNOWN;
  if (typeof raw !== 'string') raw = String(raw);

  // Trim whitespace and remove trailing punctuation
  let s = raw.trim().replace(trailingPunctuationRegex, '');

  // Normalize internal whitespace and casing
  s = s.replace(/\s+/g, ' ').toLowerCase();

  // Map common variants to canonical values
  if (s === 'automatically upgraded' || s === 'auto upgraded' || s === 'auto-upgraded' || s === 'auto_upgraded') {
    return CANONICAL_STATUSES.AUTOMATICALLY_UPGRADED;
  }
  if (s === 'pending' || s === 'in progress' || s === 'in-progress' || s === 'in_progress') {
    return CANONICAL_STATUSES.PENDING;
  }
  if (s === 'failed' || s === 'error' || s === 'failed to upgrade') {
    return CANONICAL_STATUSES.FAILED;
  }

  // If it already matches a canonical value, return it
  const canonicalValues = Object.values(CANONICAL_STATUSES);
  if (canonicalValues.includes(s)) return s;

  // Fallback to unknown
  return CANONICAL_STATUSES.UNKNOWN;
}

module.exports = {
  normalizeStatus,
  CANONICAL_STATUSES
};