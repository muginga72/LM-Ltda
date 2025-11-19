// cient/src/pages/LearnMore.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const LearnMore = () => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Optional: simple language switcher for EN/PT/FR
  const LANGS = [
    { code: "en", label: "English" },
    { code: "pt", label: "Português" },
    { code: "fr", label: "Français" },
  ];

  useEffect(() => {
    const fetchLearnMoreData = async () => {
      try {
        const response = await axios.get("/api/testimonials");
        setData(response.data);
      } catch (err) {
        console.error("Error fetching LearnMore data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLearnMoreData();
  }, []);

  if (loading || !data) return <div>Loading...</div>;

  const { wedding = [], tutoringChemistry = [] } = data;

  return (
    <div className="learn-more container text-center">
      {/* Language switcher */}
      <div className="d-flex justify-content-end mt-3">
        <div className="btn-group" role="group" aria-label="Language switcher">
          {LANGS.map((l) => (
            <button
              key={l.code}
              className={`btn btn-sm ${
                i18n.language === l.code ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => i18n.changeLanguage(l.code)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <h1 style={{ marginTop: "30px" }}>{t("overview.title")}</h1>
      <p>{t("overview.content")}</p>

      <h2>{t("howItWorks.title")}</h2>
      <p>{t("howItWorks.content")}</p>

      <h2>{t("benefitsValues.title")}</h2>
      <ul className="list-unstyled">
        {t("benefitsValues.content", { returnObjects: true }).map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>

      <h2>{t("useCases.title")}</h2>
      <p>{t("useCases.content")}</p>

      <h2>{t("techStack.title")}</h2>
      <p>{t("techStack.content")}</p>

      <h2>{t("developerFeatures.title")}</h2>
      <p>{t("developerFeatures.content")}</p>

      <h2>{t("scalability.title")}</h2>
      <p>{t("scalability.content")}</p>

      <h2>{t("callToAction.title")}</h2>
      <p>{t("callToAction.content")}</p>

      <h2>{t("weddingTitle")}</h2>
      {wedding.length > 0 ? (
        wedding.map((tst, i) => (
          <blockquote key={`wedding-${i}`}>
            <p>"{tst.quote}"</p>
            <footer>— {tst.name}</footer>
          </blockquote>
        ))
      ) : (
        <p>No wedding testimonials available.</p>
      )}

      <h2>{t("tutoringTitle")}</h2>
      {tutoringChemistry.length > 0 ? (
        tutoringChemistry.map((tst, i) => (
          <blockquote key={`tutoring-${i}`}>
            <p>"{tst.quote}"</p>
            <footer>— {tst.name}</footer>
          </blockquote>
        ))
      ) : (
        <p>No tutoring testimonials available.</p>
      )}

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
    </div>
  );
};

export default LearnMore;
