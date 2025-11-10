// src/components/HomePage.jsx
import React, { useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CardsLayout from "../components/CardsLayout";
import WelcomeBanner from "../components/WelcomeBanner";
import { useTranslation } from "react-i18next";
import "../i18n";

function HomePage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Optional: force language to browser language if not already set
    const browserLang = navigator.language.split("-")[0];
    if (i18n.language !== browserLang) {
      i18n.changeLanguage(browserLang);
    }
  }, [i18n]);

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
                {t("whoWeAreBtn")}
              </Button>
              <Button
                variant="outline-primary"
                style={{ color: "blue" }}
                onClick={() => navigate("/contact")}
              >
                {t("contactUsBtn")}
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
      <div className="bg-warning text-dark text-center py-4">
        <Container>
          <h4 className="mb-2">{t("season.message")}</h4>
          <footer className="text-center py-1">
            <small>
              <p>
                Rua do Sapsapeiro F-7A, Sapú 2, Luanda, Angola <br />
                {t("footer.phone")}
              </p>
              &copy; {new Date().getFullYear()} {t("lmLtd")}. {t("footer.rights")}
            </small>
          </footer>
        </Container>
      </div>
    </>
  );
}

export default HomePage;