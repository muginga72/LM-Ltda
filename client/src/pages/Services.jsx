import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ServicesList from "../components/ServicesList";
import { useTranslation } from "react-i18next";
import "../i18n";

const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { t, i18n } = useTranslation();

  // Ensure UI language follows browser (run once)
  useEffect(() => {
    const browserLang = navigator.language?.split("-")[0];
    if (browserLang && i18n.language !== browserLang) {
      i18n.changeLanguage(browserLang).catch(() => {});
    }
  });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE}/api/services`, { signal });
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Failed to fetch services: ${res.status} ${txt}`);
        }
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid response format");
        setServices(data);
      } catch (err) {
        if (err.name === "AbortError") {
          // ignore abort
        } else {
          console.error("Error fetching services:", err);
          setError(t("services.error") || "Error loading services");
        }
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [t]);

  const normalizeImagePath = (raw) => {
    if (!raw) return null;
    try {
      const u = new URL(raw);
      return u.toString();
    } catch {
    }
    // It starts with /uploads or uploads
    if (raw.startsWith("/uploads")) return `${BASE}${raw}`;
    if (raw.startsWith("uploads/")) return `${BASE}/${raw}`;
    return `${BASE}/uploads/${raw.replace(/^\/+/, "")}`;
  };

  if (loading) return <p className="text-center my-4">{t("services.loading") || "Loading services…"}</p>;
  if (error) return <p className="text-center text-danger my-4">{error}</p>;

  return (
    <>
      <Container className="mt-5 text-center">
        <h2 className="mb-4">{t("services.title")}</h2>
        <Row className="justify-content-center">
          {services.length === 0 ? (
            <p>{t("services.empty") || "No services found"}</p>
          ) : (
            services.map((service) => {
              const key = service._id || service.id || service.title;
              const imgPath = service.imagePath || service.image || service.filename || null;
              return (
                <Col
                  key={key}
                  xs="auto"
                  className="d-flex justify-content-center mb-4"
                >
                  <div style={{ width: "400px" }}>
                    <ServicesList
                      serviceId={service._id || service.id}
                      title={service.title || "Untitled"}
                      description={service.description || ""}
                      price={service.price ?? ""}
                      imagePath={normalizeImagePath(imgPath)}
                    />
                  </div>
                </Col>
              );
            })
          )}
        </Row>
      </Container>

      <div className="bg-warning text-dark text-center py-4">
        <Container>
          <h4 className="mb-2">{t("season.message")}</h4>
          <footer className="text-center py-1">
            <small>
              <p>
                Rua do Sapsapeiro F-7A, Sapú 2, Luanda, Angola <br />
                {t("footer.phone")}
              </p>
              &copy; {new Date().getFullYear()} {t("lmLtd")}. {t("footer.rights")}
            </small>
          </footer>
        </Container>
      </div>
    </>
  );
}

export default Services;