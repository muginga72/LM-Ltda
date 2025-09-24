import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
  };

  const handleClose = () => {
    // Hide the form (and success message)
    setIsOpen(false);

    // Optional: navigate away
    navigate("/");
  };

  // If the user has closed the form, render nothing
  if (!isOpen) {
    return null;
  }

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
          <form onSubmit={handleSubmit}>
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

            <textarea
              name="message"
              placeholder="Message"
              className="form-control mb-3"
              value={formData.message}
              onChange={handleChange}
              required
            />

            <button type="submit" className="btn btn-primary">
              Send
            </button>
          </form>
        )}
      </div>

      <footer className="text-center py-4 border-top">
        <small>
          &copy; {new Date().getFullYear()} LM Ltd. All rights
          reserved.
        </small>
      </footer>
    </>
  );
};

export default Contact;