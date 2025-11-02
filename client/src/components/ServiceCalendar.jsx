// client/src/components/ServiceCalendar.jsx

import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Spinner, Table } from 'react-bootstrap';
import axios from 'axios';

const ENDPOINTS = [
  '/api/calendar/availability',             // preferred
  '/api/admin/calendar/availability',       // fallback if admin routes used
  '/api/admin/calendar',                    // fallback: some backends return slots at base calendar path
];

const ServiceCalendar = () => {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [triedEndpoint, setTriedEndpoint] = useState(null);

  const fetchFrom = useCallback(async (url) => {
    setTriedEndpoint(url);
    try {
      const res = await axios.get(url);
      const data = Array.isArray(res.data) ? res.data : (res.data && res.data.availability) ? res.data.availability : [];
      return { ok: true, data };
    } catch (err) {
      return { ok: false, status: err?.response?.status, message: err?.response?.data?.error || err.message || 'Request failed' };
    }
  }, []);

  const fetchAvailability = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAvailability([]);
    try {
      let success = false;
      let lastError = null;
      for (let i = 0; i < ENDPOINTS.length; i++) {
        const url = ENDPOINTS[i];
        const result = await fetchFrom(url);
        if (result.ok) {
          setAvailability(result.data || []);
          success = true;
          break;
        } else {
          lastError = { url, ...result };
          if (result.status === 404) {
            // try next endpoint
            continue;
          } else {
            continue;
          }
        }
      }

      if (!success) {
        if (lastError) {
          if (lastError.status === 404) {
            setError({ type: 'not_found', message: `Availability endpoint not found. Tried: ${ENDPOINTS.join(', ')}` });
          } else {
            setError({ type: 'server', message: `Request to ${lastError.url} failed: ${lastError.message}` });
          }
        } else {
          setError({ type: 'unknown', message: 'Failed to fetch availability.' });
        }
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFrom]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const handleRetry = () => {
    setError(null);
    fetchAvailability();
  };

  return (
    <div className="p-3">
      <h5>Service Availability</h5>

      {loading && (
        <div className="my-3">
          <Spinner animation="border" size="sm" /> <span className="ms-2">Loading availability…</span>
        </div>
      )}

      {!loading && error && (
        <Alert variant={error.type === 'not_found' ? 'warning' : 'danger'}>
          <div><strong>Error:</strong> {error.message}</div>
          <div className="mt-2">
            <small>Last tried: <code>{triedEndpoint || 'none'}</code>. If you control the backend, ensure one of these endpoints is exposed: <code>{ENDPOINTS.join(', ')}</code></small>
          </div>
          <div className="mt-2">
            <Button size="sm" onClick={handleRetry} variant="outline-primary">Retry</Button>{' '}
            <Button size="sm" onClick={() => window.location.reload()} variant="outline-secondary">Reload page</Button>
          </div>
        </Alert>
      )}

      {!loading && !error && availability.length === 0 && (
        <Alert variant="info">No availability found. If you expect data, verify the backend route and payload schema.</Alert>
      )}

      {!loading && availability.length > 0 && (
        <Table bordered hover size="sm" className="mt-3">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {availability.map((slot) => {
              const id = slot._id || slot.id || `${slot.date}-${slot.time}`;
              return (
                <tr key={id}>
                  <td>{slot.date}</td>
                  <td>{slot.time}</td>
                  <td>{slot.available ? 'Yes' : 'No'}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ServiceCalendar;