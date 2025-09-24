// src/components/HomePage.jsx
import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CardsLayout from "../components/CardsLayout";

function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <section className="text-center py-2">
        <Container>
          <div style={{ padding: "2rem 0rem 0rem", textAlign: "center" }}>
            <h1>Welcome to LM Ltda</h1>
            <p>Explore our mission, values, and what makes us different.</p>
            <div style={{ marginBottom: "1rem" }}>
              <Button
                variant="outline-primary"
                style={{ color: "blue", marginRight: "1rem" }}
                onClick={() => window.open("/who-we-are", "_blank")}
              >
                Who We Are
              </Button>
              <Button
                variant="outline-primary"
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
        <CardsLayout />
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
              &copy; {new Date().getFullYear()} LM Ltd. All rights reserved.
            </small>
          </footer>
        </Container>
      </section>
    </>
  );
}

export default HomePage;