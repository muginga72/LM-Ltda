// src/components/HomePage.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import HomePageLayout from "../components/HomePageLayout";
import axios from "axios";

function HomePage() {
  const [features, setfeatures] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/home")
      .then((res) => setfeatures(res.data.features))
      .catch(console.error);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="text-center py-2">
        <Container>
          <div style={{ padding: "2rem 0rem 0rem", textAlign: "center" }}>
            <h1>Welcome to LMJ Services</h1>
            <p>Explore our mission, values, and what makes us different.</p>

            <div style={{ marginBottom: "1rem" }}>
              <Button
                variant="light"
                style={{ color: "blue", marginRight: "1rem" }}
                onClick={() => window.open("/who-we-are", "_blank")}
              >
                Who We Are
              </Button>
              <Button
                variant="light"
                style={{ color: "blue" }}
                onClick={() => navigate("/contact")}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Feature Grid */}
      <section className="py-3">
        <Container>
          <Row className="justify-content-center">
            {features.map((feature, index) => (
              <Col key={index} xs={12} md={4} lg={4} className="mb-4 d-flex">
                <HomePageLayout
                  title={feature.title}
                  description={feature.price} // Using price as description fallback
                  image={`/images/${feature.image}`}
                  link={feature.link}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Seasonal Banner */}
      <section className="bg-warning text-dark text-center py-4">
        <Container>
          <h4 className="mb-0">
            "Love served fresh. From intimate dinners to grand wedding
            celebrations—this season is made to be savored."
          </h4>
          <footer className="text-center py-4">
            <small>
              &copy; {new Date().getFullYear()} LM Ltda. All rights reserved.
            </small>
          </footer>
        </Container>
      </section>
    </>
  );
}

export default HomePage;