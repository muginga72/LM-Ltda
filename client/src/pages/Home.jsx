// src/components/HomePage.jsx
import React from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CardsLayout from "../components/CardsLayout";
import WelcomeBanner from "../components/WelcomeBanner";

function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <section className="text-center">
        <Container>
          <div style={{ textAlign: "center" }}>
            <WelcomeBanner />
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
      </section>
    </>
  );
}

export default HomePage;
