import React from "react";
import { Row, Col, Card, Carousel, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const IMAGE_BORDER_RADIUS = 5;

const CardSet = ({ set }) => {
  const { t } = useTranslation();

  const translateTitle = (title, side = "right") => {
    const keySide = side === "left" ? "card.left." : "card.right.";
    return t(`${keySide}${title}`, { defaultValue: title });
  };

  const leftItems = Array.isArray(set?.left?.items) && set.left.items.length > 0
    ? set.left.items.slice(0, 2)
    : [{ ...set.left }];

  return (
    <Row className="gx-3 gy-4">
      {/* Left column: stacked vertical cards + promo carousel */}
      <Col xs={12} md={6} className="d-flex flex-column h-100">
        <div className="d-flex flex-column h-100" style={{ gap: "1rem" }}>
          {/* Upper 60%: two vertical cards */}
          <div
            className="d-flex flex-column"
            style={{
              flexBasis: "60%",
              flexGrow: 0,
              flexShrink: 0,
              gap: "0.75rem",
              overflow: "hidden",
              minHeight: 0,
            }}
          >
            {leftItems.map((item, i) => (
              <Card key={i} className="flex-fill d-flex flex-column">
                <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fluid
                    style={{ objectFit: "cover", width: "100%", height: "350px", 
                      borderTopLeftRadius: IMAGE_BORDER_RADIUS,
                      borderTopRightRadius: IMAGE_BORDER_RADIUS,
                    }}
                  />
                </div>
                <Card.Body className="d-flex flex-column justify-content-between text-center p-3">
                  <div>
                    <Card.Title style={{ fontSize: "1.5rem" }}>
                      {translateTitle(item.title || set.left.title, "left")}
                    </Card.Title>
                    {item.description && (
                      <Card.Text style={{ fontSize: "0.9rem", color: "#555" }}>
                        {item.description}
                      </Card.Text>
                    )}
                    {item.price !== undefined && (
                      <div style={{ fontWeight: 600 }}>{item.price}</div>
                    )}
                  </div>
                  <div className="mt-2">
                    <Link to="/rooms" className="btn btn-outline-primary btn-sm">
                      {t("button.explore")}
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>

          {/* Lower 37%: promotional videos carousel */}
          <Card
            className="d-flex flex-column"
            style={{
              flexBasis: "37%",
              flexGrow: 0,
              flexShrink: 0,
              overflow: "hidden",
              minHeight: 0,
            }}
          >
            <Card.Body className="d-flex flex-column p-2" style={{ justifyContent: "space-between" }}>
              <div style={{ flex: 1, minHeight: 0 }}>
                {Array.isArray(set.left.videos) && set.left.videos.length > 0 ? (
                  <Carousel
                    indicators={set.left.videos.length > 1}
                    controls={set.left.videos.length > 1}
                    variant="dark"
                    className="w-100"
                  >
                    {set.left.videos.map((video, i) => (
                      <Carousel.Item key={i}>
                        {video.type === "video" ? (
                          <video
                            src={video.src}
                            controls
                            style={{ width: "100%", height: "200px", objectFit: "cover" }}
                          />
                        ) : (
                          <div style={{ width: "100%", height: "200px", background: "#000" }}>
                            <iframe
                              title={`promo-${i}`}
                              src={video.src}
                              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              style={{ width: "100%", height: "100%" }}
                            />
                          </div>
                        )}
                        {video.caption && (
                          <Carousel.Caption>
                            <small>{video.caption}</small>
                          </Carousel.Caption>
                        )}
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : (
                  <div className="d-flex flex-column justify-content-center align-items-center w-100 h-100">
                    <p className="mb-2 text-center">{t("promo.noVideos", "No promotional videos")}</p>
                  </div>
                )}
              </div>

              <div className="mt-2 d-flex justify-content-center" style={{ gap: "0.5rem" }}>
                {set.left.price !== undefined && (!Array.isArray(set.left.items) || set.left.items.length === 0) && (
                  <div className="me-2 align-self-center">
                    <strong>{set.left.price}</strong>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </div>
      </Col>

      {/* Right stacked cards (unchanged) */}
      <Col xs={12} md={6}>
        <div className="d-flex flex-column h-100 gap-3">
          {Array.isArray(set.right) &&
            set.right.map((item, idx) => (
              <Card key={idx} className="flex-fill d-flex flex-column">
                <Card.Img variant="top" src={item.image} />
                <Card.Body className="d-flex flex-column text-center" style={{ justifyContent: "space-between" }}>
                  <div>
                    <Card.Title style={{ fontSize: "1.5rem" }}>
                      {translateTitle(item.title, "right")}</Card.Title>
                    {item.description && (
                      <Card.Text style={{ fontSize: "0.9rem", color: "#555" }}>
                        {item.description}
                      </Card.Text>
                    )}
                    {item.price !== undefined && <Card.Text>{item.price}</Card.Text>}
                  </div>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Link to="/services" className="btn btn-outline-primary">
                      {t("button.explore")}
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            ))}
        </div>
      </Col>
    </Row>
  );
};

export default CardSet;