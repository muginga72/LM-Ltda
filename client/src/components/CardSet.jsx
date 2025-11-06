import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CardSet = ({ set }) => {
  const { t } = useTranslation();

  const translateTitle = (title, side = "right") => {
    // normalize key: left vs right
    const keySide = side === "left" ? "card.left." : "card.right.";
    return t(`${keySide}${title}`, { defaultValue: title });
  };

  return (
    <Row className="gx-3 gy-4">
      {/* Left tall card */}
      <Col xs={12} md={6}>
        <Card className="h-100 d-flex flex-column">
          <Card.Img variant="top" src={set.left.image} />
          <Card.Body className="d-flex flex-column text-center">
            <Card.Title>{translateTitle(set.left.title, "left")}</Card.Title>
            {set.left.price !== undefined && (
              <Card.Text>{set.left.price}</Card.Text>
            )}
            <Link to="/services" className="btn btn-outline-primary">
              {t("button.explore")}
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
                  <Card.Title>{translateTitle(item.title, "right")}</Card.Title>
                  {item.price !== undefined && (
                    <Card.Text>{item.price}</Card.Text>
                  )}
                  <Link to="/services" className="btn btn-outline-primary">
                    {t("button.explore")}
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