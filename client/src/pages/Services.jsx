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
    <>
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
                  price={service.price}
                  link={`/services/${service.id}`}
                />
              </div>
            </Col>
          ))}
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
