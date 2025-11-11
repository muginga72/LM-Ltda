import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ServiceCardWithModals from "../components/ServiceCardWithModals";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../i18n";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Optional: force language to browser language if not already set
    const browserLang = navigator.language.split("-")[0];
    if (i18n.language !== browserLang) {
      i18n.changeLanguage(browserLang);
    }
  }, [i18n]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/services", {
          signal: controller.signal,
        });

        if (Array.isArray(response.data)) {
          setServices(response.data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Fetch cancelled");
        } else {
          console.error("Error fetching services:", err);
          setError(t("services.error"));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServices();

    return () => controller.abort();
  }, [t]);

  if (loading) return <p>{t("services.loading")}</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <Container className="mt-5 text-center">
        <h2 className="mb-4">{t("services.title")}</h2>
        <Row className="justify-content-center">
          {services.length === 0 ? (
            <p>{t("services.empty")}</p>
          ) : (
            services.map((service) => (
              <Col
                key={service._id}
                xs="auto"
                className="d-flex justify-content-center mb-4"
              >
                <div style={{ width: "400px" }}>
                  <ServiceCardWithModals
                    serviceId={service._id}
                    title={service.title}
                    description={service.description}
                    imagePath={service.imagePath || "/images/placeholder.png"}
                    price={service.price}
                    link={`/services/${service._id}`}
                  />
                </div>
              </Col>
            ))
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
              &copy; {new Date().getFullYear()} LM Ltd. {t("footer.rights")}
            </small>
          </footer>
        </Container>
      </div>
    </>
  );
}

export default Services;