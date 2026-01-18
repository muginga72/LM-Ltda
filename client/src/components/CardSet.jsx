import React from "react";
import { Row, Col, Card, Carousel, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const IMAGE_BORDER_RADIUS = 5;

/* Locale helpers for European date/time and currency formatting */
const localeForLang = (lang) => {
  if (!lang) return "en-GB";
  if (lang.startsWith("pt")) return "pt-PT";
  if (lang.startsWith("fr")) return "fr-FR";
  return "en-GB";
};

const formatDateTimeEurope = (value, lang, options = {}) => {
  if (!value) return "";
  const locale = localeForLang(lang);
  const date = value instanceof Date ? value : new Date(value);
  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(
    date
  );
};

const formatCurrencyEurope = (amount, lang, currency = "EUR") => {
  if (amount === null || amount === undefined || amount === "") return "";
  const locale = localeForLang(lang);
  if (typeof amount === "string") {
    const parsed = Number(amount.replace(/[^0-9.,-]/g, "").replace(",", "."));
    if (Number.isFinite(parsed)) {
      amount = parsed;
    } else {
      return amount;
    }
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
};

/* Helper to create stable translation keys from arbitrary titles (removes emojis/punctuation) */
const keyFromTitle = (title = "") =>
  String(title)
    .toLowerCase()
    .replace(/[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "") // remove many emoji ranges
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "untitled";

const CardSet = ({ set = {} }) => {
  const { t, i18n } = useTranslation();

  const translateTitle = (title, side = "right") => {
    if (!title) return "";
    const key = keyFromTitle(title);
    const ns = side === "left" ? `card.left.${key}` : `card.right.${key}`;
    return t(ns, { defaultValue: title });
  };

  const translateDescription = (title, side = "right", fallback = "") => {
    if (!title) return fallback;
    const key = keyFromTitle(title);
    const ns = side === "left" ? `card.left.desc.${key}` : `card.right.desc.${key}`;
    return t(ns, { defaultValue: fallback || "" });
  };

  const leftItems =
    Array.isArray(set?.left?.items) && set.left.items.length > 0
      ? set.left.items.slice(0, 2)
      : set.left
      ? [{ ...set.left }]
      : [];

  const currency = set?.currency || "EUR";

  return (
    <Row className="gx-3 gy-4">
      {/* Left column */}
      <Col xs={12} md={6} className="d-flex flex-column h-100">
        <div className="d-flex flex-column h-100" style={{ gap: "1rem" }}>
          {/* Upper: two vertical cards */}
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
            {leftItems.map((item, i) => {
              const title = item.title || set.left?.title || "";
              const description =
                item.description || set.left?.description || "";
              return (
                <Card key={i} className="flex-fill d-flex flex-column">
                  <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={title}
                        fluid
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "350px",
                          borderTopLeftRadius: IMAGE_BORDER_RADIUS,
                          borderTopRightRadius: IMAGE_BORDER_RADIUS,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "350px",
                          background: "#e9ecef",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderTopLeftRadius: IMAGE_BORDER_RADIUS,
                          borderTopRightRadius: IMAGE_BORDER_RADIUS,
                        }}
                      >
                        <small>{t("image.placeholder", "No image")}</small>
                      </div>
                    )}
                  </div>

                  <Card.Body className="d-flex flex-column justify-content-between text-center p-3">
                    <div>
                      <Card.Title style={{ fontSize: "1.5rem" }}>
                        {translateTitle(title, "left")}
                      </Card.Title>

                      {item.updatedAt && (
                        <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: 6 }}>
                          {t("label.updated", "Updated")}:{" "}
                          {formatDateTimeEurope(item.updatedAt, i18n.language)}
                        </div>
                      )}

                      {description && (
                        <Card.Text style={{ fontSize: "0.9rem", color: "#555" }}>
                          {translateDescription(title, "left", description)}
                        </Card.Text>
                      )}

                      {item.price !== undefined && item.price !== "" && (
                        <div style={{ fontWeight: 600 }}>
                          {formatCurrencyEurope(item.price, i18n.language, currency)}
                        </div>
                      )}
                    </div>

                    <div className="mt-2">
                      <Link to="/rooms" className="btn btn-outline-primary btn-sm">
                        {t("button.explore")}
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </div>

          {/* Lower: promotional videos carousel */}
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
                {Array.isArray(set.left?.videos) && set.left.videos.length > 0 ? (
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
                            <small>{t(`video.${keyFromTitle(video.caption)}`, { defaultValue: video.caption })}</small>
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
                {set.left?.price !== undefined &&
                  (!Array.isArray(set.left?.items) || set.left.items.length === 0) && (
                    <div className="me-2 align-self-center">
                      <strong>{formatCurrencyEurope(set.left.price, i18n.language, currency)}</strong>
                    </div>
                  )}
              </div>
            </Card.Body>
          </Card>
        </div>
      </Col>

      {/* Right column */}
      <Col xs={12} md={6}>
        <div className="d-flex flex-column h-100 gap-3">
          {Array.isArray(set.right) &&
            set.right.map((item, idx) => {
              const title = item.title || "";
              const description = item.description || "";
              return (
                <Card key={idx} className="flex-fill d-flex flex-column">
                  {item.image ? <Card.Img variant="top" src={item.image} /> : <div style={{ width: "100%", height: 180, background: "#f1f3f5" }} />}

                  <Card.Body className="d-flex flex-column text-center" style={{ justifyContent: "space-between" }}>
                    <div>
                      <Card.Title style={{ fontSize: "1.5rem" }}>{translateTitle(title, "right")}</Card.Title>

                      {item.updatedAt && (
                        <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: 6 }}>
                          {t("label.updated", "Updated")}: {formatDateTimeEurope(item.updatedAt, i18n.language)}
                        </div>
                      )}

                      {description && (
                        <Card.Text style={{ fontSize: "0.9rem", color: "#555" }}>
                          {translateDescription(title, "right", description)}
                        </Card.Text>
                      )}

                      {item.price !== undefined && item.price !== "" && (
                        <Card.Text>{formatCurrencyEurope(item.price, i18n.language, currency)}</Card.Text>
                      )}
                    </div>

                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Link to="/services" className="btn btn-outline-primary btn-sm mt-2">
                        {t("button.explore")}
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
        </div>
      </Col>
    </Row>
  );
};

export default CardSet;