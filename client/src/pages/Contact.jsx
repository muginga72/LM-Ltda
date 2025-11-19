import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../i18n";

const Contact = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeLang, setActiveLang] = useState(i18n.language || "en");

  useEffect(() => {
    const handleLangChange = () => setActiveLang(i18n.language);
    i18n.on("languageChanged", handleLangChange);
    return () => i18n.off("languageChanged", handleLangChange);
  }, [i18n]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!/^[\d\s()+-]{7,20}$/.test(formData.phone)) {
      setError(t("contact.phoneError"));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || t("contact.serverError"));
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

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="container py-5">
        {/* Language Tabs */}
        <div style={{ display: "flex", borderBottom: "2px solid #ccc", marginBottom: "1rem" }}>
          {["en", "pt", "fr"].map((lng) => (
            <div
              key={lng}
              onClick={() => changeLanguage(lng)}
              style={{
                padding: "0.5rem 1rem",
                cursor: "pointer",
                borderBottom: activeLang === lng ? "3px solid #007bff" : "3px solid transparent",
                fontWeight: activeLang === lng ? "bold" : "normal"
              }}
            >
              {lng === "en" && "English"}
              {lng === "pt" && "Português"}
              {lng === "fr" && "Français"}
            </div>
          ))}
        </div>

        <h2>{t("contact.title")}</h2>

        {submitted ? (
          <>
            <div className="alert alert-success" role="alert">
              {t("contact.success")}
            </div>
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              {t("contact.close")}
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
              placeholder={t("contact.name")}
              className="form-control mb-3"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder={t("contact.email")}
              className="form-control mb-3"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder={t("contact.phone")}
              className="form-control mb-3"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              placeholder={t("contact.message")}
              className="form-control mb-3"
              value={formData.message}
              onChange={handleChange}
              required
            />

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t("contact.sending") : t("contact.send")}
            </button>
          </form>
        )}
      </div>

      <footer className="text-center py-4 border-top">
        <small>
          <p>
            <strong>{t("contact.footer.phones")}:</strong>{" "}
            (+244) 222 022 351; (+244) 942 154 545; (+244) 921 588 083; (+244) 939 207 046
            <br />
            {t("contact.footer.address")}
          </p>
          &copy; {new Date().getFullYear()} LM-Ltd Services. {t("contact.footer.copyright")}
        </small>
      </footer>
    </>
  );
};

export default Contact;