import React, { useEffect } from "react";
import { Container, Row, Col, Carousel, Image, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslation } from "react-i18next";
import "../i18n";

const ServicesPromo = () => {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Optional: force language to browser language if not already set
    const browserLang = navigator.language.split("-")[0];
    if (i18n.language !== browserLang) {
      i18n.changeLanguage(browserLang);
    }
  }, [i18n]);

  const products = [
    {
      name: t("product1"),
      image: "/images/salao-de-festas-00.jpg",
    },
    {
      name: t("product2"),
      image: "/images/order-the-meal.jpg",
    },
    {
      name: t("product3"),
      image: "/images/buffet-service.png",
    },
    {
      name: t("product4"),
      image: "/images/Roomrental-03.png",
    },
    // {
    //   name: t("product4"),
    //   image: "/images/tutoring-chemistry.png",
    // },
    {
      name: t("product5"),
      image: "/images/wedding-bsket-ring.jpg",
    },
    {
      name: t("product6"),
      image: "/images/cocktail-drinks.jpg",
    },
    {
      name: t("product7"),
      image: "/images/salao-festas-1.JPG",
    },
    {
      name: t("product8"),
      image: "/images/edificio-caculo.jpg",
    }, 
  ];

  return (
    <div>
      <Container fluid className="bg-light px-5 shadow-sm">
        <Row className="align-items-center">
          <Col md={4} className="text-center text-md-start mb-4 mb-md-0">
            <h2 className="fw-bold text-danger">{t("promoText1")}</h2>
            <p className="lead text-muted">{t("promoText2")}</p>
            <Button
              onClick={() => window.open("/learn-more", "_blank")}
              style={{
                marginRight: "1rem",
                borderRadius: "12px",
              }}
              variant="primary"
            >
              {t("learnMoreBtn")}
            </Button>
          </Col>
          <Col md={8} className="d-flex justify-content-center">
            <Carousel className="w-75 text-center">
              {products.map((product, index) => (
                <Carousel.Item key={index}>
                  <div className="d-flex flex-column align-items-center mb-4">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fluid
                      rounded
                      style={{
                        height: "200px",
                        objectFit: "cover",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Carousel.Caption className="text-center">
                      <h5>{product.name}</h5>
                      <p>{product.description || ""}</p>
                    </Carousel.Caption>
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ServicesPromo;