import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ServiceCardWithModals from "../components/ServiceCardWithModals";
import axios from "axios";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ✅ AbortController prevents duplicate fetches in StrictMode
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
          setError("Failed to load services. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServices();

    // Cleanup cancels the duplicate fetch triggered by StrictMode
    return () => controller.abort();
  }, []);

  if (loading) return <p>Loading services...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <Container className="mt-5 text-center">
        <h2 className="mb-4">Our Services</h2>
        <Row className="justify-content-center">
          {services.length === 0 ? (
            <p>No services available.</p>
          ) : (
            services.map((service) => (
              <Col
                key={service._id}
                xs="auto"
                className="d-flex justify-content-center mb-4"
              >
                <div style={{ width: "400px" }}>
                  <ServiceCardWithModals
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
          <h4 className="mb-2">
            "Love served fresh. From intimate dinners to grand wedding
            celebrations—this season is made to be savored."
          </h4>
          <footer className="text-center py-1">
            <small>
              <p>
                Rua do Sapsapeiro F-7A, Sapú 2, Luanda, Angola <br />
                Tel. : (+244) 222 022 351; (+244) 975 957 847
              </p>
              &copy; {new Date().getFullYear()} LM Ltd. All rights reserved.
            </small>
          </footer>
        </Container>
      </div>
    </>
  );
}

export default Services;