// client/src/components/admin/AdminScheduleForm.jsx

import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const AdminScheduleForm = ({ onEventCreated, onEventUpdated, onEventDeleted }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [userId, setUserId] = useState('');
  const [eventId, setEventId] = useState('');
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE = '/api/admin/calendar';

  useEffect(() => {
    let mounted = true;
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await axios.get(API_BASE);
        if (mounted) setEvents(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to fetch events', err);
        setMessage('Failed to load events.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchEvents();
    return () => { mounted = false; };
  }, []);

  const resetForm = () => {
    setTitle('');
    setDate('');
    setTime('');
    setUserId('');
    setEventId('');
  };

  const handleSelect = (e) => {
    const selectedId = e.target.value || '';
    if (!selectedId) {
      resetForm();
      return;
    }
    const selected = events.find(ev => String(ev._id || ev.id) === selectedId);
    if (!selected) return;
    setEventId(String(selected._id || selected.id));
    setTitle(selected.title || '');
    setDate(selected.date ? (selected.date.split('T')[0] || selected.date) : '');
    setTime(selected.time || '');
    setUserId(String(selected.userId ?? ''));
  };

  const syncAddEvent = (event) => {
    setEvents(prev => {
      // avoid duplicates
      const id = String(event._id || event.id);
      if (prev.some(p => String(p._id || p.id) === id)) return prev.map(p => (String(p._id || p.id) === id ? event : p));
      return [...prev, event].sort((a, b) => {
        const da = a.date || '';
        const db = b.date || '';
        if (da < db) return -1;
        if (da > db) return 1;
        const ta = a.time || '';
        const tb = b.time || '';
        if (ta < tb) return -1;
        if (ta > tb) return 1;
        return 0;
      });
    });
  };

  const syncUpdateEvent = (event) => {
    const id = String(event._id || event.id);
    setEvents(prev => prev.map(p => (String(p._id || p.id) === id ? event : p)));
  };

  const syncDeleteEvent = (id) => {
    setEvents(prev => prev.filter(p => String(p._id || p.id) !== String(id)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!title || !date || !time || !userId) {
      setMessage('Please fill all required fields.');
      return;
    }
    try {
      const payload = { title, date, time, userId, createdByAdmin: true };
      const res = await axios.post(API_BASE, payload);
      const created = res.data;
      syncAddEvent(created);
      setMessage('✅ Event scheduled!');
      resetForm();
      if (typeof onEventCreated === 'function') onEventCreated(created);
    } catch (err) {
      console.error('Schedule error', err);
      setMessage('Failed to schedule event.');
    }
  };

  const handleUpdate = async () => {
    setMessage('');
    if (!eventId) {
      setMessage('Select an event to update.');
      return;
    }
    if (!title || !date || !time || !userId) {
      setMessage('Please fill all required fields.');
      return;
    }
    try {
      const payload = { title, date, time, userId };
      const res = await axios.put(`${API_BASE}/${eventId}`, payload);
      const updated = res.data;
      syncUpdateEvent(updated);
      setMessage('🔄 Event updated!');
      resetForm();
      if (typeof onEventUpdated === 'function') onEventUpdated(updated);
    } catch (err) {
      console.error('Update error', err);
      setMessage('Failed to update event.');
    }
  };

  const handleDelete = async () => {
    setMessage('');
    if (!eventId) {
      setMessage('Select an event to delete.');
      return;
    }
    try {
      await axios.delete(`${API_BASE}/${eventId}`);
      syncDeleteEvent(eventId);
      setMessage('🗑️ Event deleted!');
      if (typeof onEventDeleted === 'function') onEventDeleted(eventId);
      resetForm();
    } catch (err) {
      console.error('Delete error', err);
      setMessage('Failed to delete event.');
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3">
      <h5>Manage User Events</h5>

      <Form.Group className="mt-3">
        <Form.Label>Select Existing Event</Form.Label>
        <Form.Select onChange={handleSelect} value={eventId}>
          <option value="">-- Create New / Select Event --</option>
          {loading && <option disabled>Loading events...</option>}
          {events.map(ev => {
            const id = String(ev._id || ev.id);
            const displayDate = ev.date ? (ev.date.split('T')[0] || ev.date) : '';
            return (
              <option key={id} value={id}>
                {ev.title} {displayDate ? `(${displayDate} @ ${ev.time || '—'})` : ''}
              </option>
            );
          })}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mt-3">
        <Form.Label>Event Title</Form.Label>
        <Form.Control
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter event title"
        />
      </Form.Group>

      <Row>
        <Col>
          <Form.Group className="mt-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mt-3">
            <Form.Label>Time</Form.Label>
            <Form.Control
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mt-3">
        <Form.Label>User ID</Form.Label>
        <Form.Control
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          placeholder="Target user ID"
        />
      </Form.Group>

      <div className="mt-4">
        <Button type="submit" variant="outline-primary">
          Schedule
        </Button>{' '}
        <Button variant="outline-warning" onClick={handleUpdate} disabled={!eventId}>
          Update
        </Button>{' '}
        <Button variant="outline-danger" onClick={handleDelete} disabled={!eventId}>
          Delete
        </Button>{' '}
        <Button variant="secondary" onClick={resetForm}>
          Clear
        </Button>
      </div>

      {message && <Alert variant="info" className="mt-3">{message}</Alert>}
    </Form>
  );
};

export default AdminScheduleForm;