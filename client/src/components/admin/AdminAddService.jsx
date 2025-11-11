import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { createService } from "../../api/servicesApi";

function AdminAddService({ show, onHide, onCreated, token }) {
  const { t } = useTranslation();

  const [form, setForm] = useState({ title: "", description: "", price: "" });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = new FormData();
      payload.append("title", form.title.trim());
      payload.append("description", form.description.trim());
      payload.append("price", parseFloat(form.price) || 0);
      if (imageFile) payload.append("image", imageFile);

      const created = await createService(payload, token, true);
      setForm({ title: "", description: "", price: "" });
      setImageFile(null);
      if (onCreated) onCreated(created);
      onHide();
    } catch (err) {
      setError(t("addServiceError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Modal.Header closeButton>
          <Modal.Title>{t("addServiceTitle")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form.Group className="mb-3">
            <Form.Control
              required
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder={t("addServiceFieldTitle")}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder={t("addServiceFieldDescription")}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="number"
              step="0.01"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder={t("addServiceFieldPrice")}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide} disabled={saving}>
            {t("addServiceButtonCancel")}
          </Button>
          <Button type="submit" variant="outline-primary" disabled={saving}>
            {saving ? <Spinner animation="border" size="sm" /> : t("addServiceButtonSubmit")}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AdminAddService;