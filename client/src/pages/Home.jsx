// src/components/Home.jsx
import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import beverageImg from "../assets/images/beverage.png";
import buffetImg from "../assets/images/buffet.png";
import tutoringImg from "../assets/images/tutoring.png";
import mealorderImg from "../assets/images/mealorder.png";
import weddingImg from "../assets/images/wedding.png";
import humburgerImg from "../assets/images/humburger.png";

const features = [
  {
    title: "🍹Beverages Service",
    img: beverageImg,
    link: "",
  },
  {
    title: "🍽️ Buffet for You",
    img: buffetImg,
    link: "",
  },
  {
    title: "📚 Tutoring",
    img: tutoringImg,
    link: "",
  },
  {
    title: "👨‍🍳 Made-to-Order Meals",
    img: mealorderImg,
    link: "",
  },
  {
    title: "💍 Wedding Events",
    img: weddingImg,
    link: "",
  },
  {
    title: "🍔 Humburgers",
    img: humburgerImg,
    link: "",
  },
];

function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section */}
      <section className="text-center py-2">
        <Container>
          <div style={{ padding: "2rem 0rem 0rem", textAlign: "center" }}>
            <h1>Welcome to LMJ Services</h1>
            <p>Explore our mission, values, and what makes us different.</p>

            <div style={{ marginBottom: "1rem" }}>
              <button
                onClick={() => window.open("/who-we-are", "_blank")}
                style={{
                  marginRight: "1rem",
                  backgroundColor: "lightgray",
                  color: "blue",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Who We Are
              </button>
              <button
                onClick={() => navigate("/contact")}
                style={{
                  marginRight: "1rem",
                  backgroundColor: "lightgray",
                  color: "blue",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Contact Us
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Feature Grid */}
      <section className="py-5">
        <Container>
          <Row className="g-4">
            {features.map((f, idx) => (
              <Col key={idx} xs={12} md={6} lg={4}>
                <Card className="h-100 shadow-sm d-flex flex-column">
                  <Card.Img
                    variant="top"
                    src={f.img}
                    alt={f.title}
                    style={{ objectFit: "cover", height: "300px" }}
                  />
                  <Card.Body className="text-center">
                    <Card.Title>{f.title}</Card.Title>
                    <Button variant="outline-primary" href={f.link}>
                      Explore
                    </Button>
                  </Card.Body>
                </Card>
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