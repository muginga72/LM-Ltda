// src/pages/Contact.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // basic phone validation (allow digits, spaces, +, -, parentheses)
    if (!/^[\d\s()+-]{7,20}$/.test(formData.phone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Server error");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate("/");
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="container py-5">
        <h2>Contact Us</h2>

        {submitted ? (
          <>
            <div className="alert alert-success" role="alert">
              Message sent successfully!
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Close
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <input
              type="text"
              name="name"
              placeholder="Name"
              className="form-control mb-3"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control mb-3"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              className="form-control mb-3"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              placeholder="Message"
              className="form-control mb-3"
              value={formData.message}
              onChange={handleChange}
              required
            />

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        )}
      </div>

      <footer className="text-center py-4 border-top">
        <small>
          <p><strong>Phones:</strong> (+244) 222 022 351; (+244) 942 154 545; (+244) 921 588 083; (+244) 939 207 046"<br/>
            Rua do Sapsapeiro F-7A, Sapú 2, Luanda, Angola
          </p>
          &copy; {new Date().getFullYear()} LM-Ltd Services. All rights reserved.
        </small>
      </footer>
    </>
  );
};

export default Contact;