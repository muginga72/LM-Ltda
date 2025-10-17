import React, { useState } from 'react';
import { createService } from '../../api/servicesApi';

function AdminAddService({ onCreated, token }) {
  const [form, setForm] = useState({
    title: '', description: '', price: '', imagePath: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price) || 0,
        imagePath: form.imagePath.trim(),
      };
      const created = await createService(payload, token);
      setForm({ title: '', description: '', price: '', imagePath: '' });
      if (onCreated) onCreated(created);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-3">
      <h5 className="mb-3">Add Service</h5>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-2">
        <input required name="title" value={form.title} onChange={handleChange} className="form-control" placeholder="Enter the service title" />
      </div>
      <div className="mb-2">
        <textarea name="description" value={form.description} onChange={handleChange} className="form-control" rows={3} placeholder="Enter a short description of the service" />
      </div>
      <div className="row mb-2">
        <div className="col">
          <input name="price" value={form.price} onChange={handleChange} type="number" step="0.01" className="form-control" placeholder="Price: e.g. 49.99" />
        </div>
      </div>
      <div className="mb-2">
        <input name="imagePath" value={form.imagePath} onChange={handleChange} className="form-control" placeholder="Enter image URL e.g. https://..." />
      </div>
      <div className="d-flex mt-2 gap-2">
        <button className="btn btn-outline-primary" disabled={saving}>{saving ? 'Saving...' : '➕ Service'}</button>
        <button type="button" className="btn btn-outline-secondary" onClick={() => setForm({ title: '', description: '', price: '', imagePath: '' })} disabled={saving}>Reset</button>
      </div>
    </form>
  );
}

export default AdminAddService;