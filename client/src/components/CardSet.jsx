import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const CardSet = ({ set }) => {
  return (
    <Row className="gx-3 gy-4">
      {/* Left tall card */}
      <Col xs={12} md={6}>
        <Card className="h-100 d-flex flex-column">
          <Card.Img variant="top" src={set.left.image} />
          <Card.Body className="d-flex flex-column text-center">
            <Card.Title>{set.left.title}</Card.Title>
            <Card.Text>{set.left.text}</Card.Text>
            <Link to="/services" className="btn btn-outline-primary">
              Explore
            </Link>
          </Card.Body>
        </Card>
      </Col>

      {/* Right stacked cards */}
      <Col xs={12} md={6}>
        <div className="d-flex flex-column h-100 gap-3">
          {Array.isArray(set.right) &&
            set.right.map((item, idx) => (
              <Card key={idx} className="flex-fill d-flex flex-column">
                <Card.Img variant="top" src={item.image} />
                <Card.Body className="d-flex flex-column text-center">
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text>{item.text}</Card.Text>
                  <Link to="/services" className="btn btn-outline-primary">
                    Explore
                  </Link>
                </Card.Body>
              </Card>
            ))}
        </div>
      </Col>
    </Row>
  );
};

export default CardSet;
