// src/pages/WhoWeAre.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../i18n"; // Ensure i18n is initialized

const WhoWeAre = () => {
  const { t, i18n } = useTranslation();
  const [activeLang, setActiveLang] = useState(i18n.language || "en");

  useEffect(() => {
    const syncLang = () => setActiveLang(i18n.language);
    i18n.on("languageChanged", syncLang);
    return () => i18n.off("languageChanged", syncLang);
  }, [i18n]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const valuesList = t("whoWeAre.values", { returnObjects: true });

  return (
    <>
      <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
        {/* Language Tabs */}
        <div style={{ display: "flex", borderBottom: "2px solid #ccc", marginBottom: "1rem" }}>
          {["en", "pt", "fr"].map((lng) => (
            <div
              key={lng}
              onClick={() => changeLanguage(lng)}
              style={{
                padding: "0.5rem 1rem",
                cursor: "pointer",
                borderBottom: activeLang === lng ? "3px solid #007bff" : "3px solid transparent",
                fontWeight: activeLang === lng ? "bold" : "normal"
              }}
            >
              {lng === "en" && "English"}
              {lng === "pt" && "Português"}
              {lng === "fr" && "Français"}
            </div>
          ))}
        </div>

        <h3>{t("whoWeAre.title")}</h3>
        <p>{t("whoWeAre.description")}</p>

        <h3>{t("whoWeAre.missionTitle")}</h3>
        <p style={{ whiteSpace: "pre-line" }}>{t("whoWeAre.mission")}</p>

        <h3>{t("whoWeAre.visionTitle")}</h3>
        <p>{t("whoWeAre.vision")}</p>

        <h3>{t("whoWeAre.valuesTitle")}</h3>
        <ul>
          {Array.isArray(valuesList) &&
            valuesList.map((item, index) => (
              <li key={index} style={{ marginBottom: "0.5rem" }}>
                {item}
              </li>
            ))}
        </ul>

        <h3>{t("whoWeAre.differentiatorsTitle")}</h3>
        <p>{t("whoWeAre.differentiators")}</p>
      </div>

      <footer className="text-center py-4 border-top">
        <small>
          <p>
            <strong>{t("whoWeAre.footer.phones")}:</strong>{" "}
            (+244) 222 022 351; (+244) 942 154 545; (+244) 921 588 083; (+244) 939 207 046
            <br />
            {t("whoWeAre.footer.address")}
          </p>
          &copy; {new Date().getFullYear()} LM-Ltd Services. {t("whoWeAre.footer.copyright")}
        </small>
      </footer>
    </>
  );
};

export default WhoWeAre;
