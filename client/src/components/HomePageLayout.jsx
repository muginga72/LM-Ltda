import React from "react";
import { Card, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function HomePageLayout({ title, description, image, link }) {
  const navigate = useNavigate();

  return (
    // Main styling for the cards for home page
    <Container className="mt-2 text-center">
      <Card style={{ width: "100%", height: "100%" }}>
        <div style={{ width: "100%", height: "300px", overflow: "hidden" }}>
          <Card.Img
            variant="top"
            src={image}
            alt={title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>
        <Card.Body className="d-flex flex-column justify-content-between">
          <div>
            <Card.Title>{title}</Card.Title>
            <Card.Text>{description}</Card.Text>
          </div>
          <Button variant="outline-primary" onClick={() => navigate(link)}>
            Learn More
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default HomePageLayout;
