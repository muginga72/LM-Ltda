import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ServiceCardWithModals from "../components/ServiceCardWithModals";
import axios from "axios";

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios
      .get("/api/services")
      .then((res) => setServices(res.data.services))
      .catch(console.error);
  }, []);

  return (
    <Container className="mt-5 text-center">
      <h2 className="mb-4">Our Services</h2>
      <Row className="justify-content-center">
        {services.map((service) => (
          <Col
            key={service.id}
            xs="auto"
            className="d-flex justify-content-center mb-4"
          >
            <div style={{ width: "350px" }}>
              <ServiceCardWithModals
                title={service.title}
                description={service.description}
                image={`/images/${service.image}`}
                link={`/services/${service.id}`}
              />
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
