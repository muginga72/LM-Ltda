// src/pages/roomrental/ContractPageListing.jsx
import React, { useEffect, useContext, useState } from "react";
import { Container, Button, Spinner, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import "../../i18n";

export default function ContractPageListing() {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const todayIso = new Date().toISOString().slice(0, 10);
  const ownerName = user?.name || user?.email || "Owner";
  const ownerPhone = user?.phone || "N/A";

  const handleAgree = async () => {
    if (saving) return;
    setSaving(true);
    setError(null);

    sessionStorage.setItem("listingContractAgreed", new Date().toISOString());

    // Build request payload
    const payload = {
      acknowledgedAt: new Date().toISOString(),
      acknowledgedByName: ownerName,
      meta: {
        // optional metadata; include user id/email if available
        userEmail: user?.email,
        userId: user?.id || user?._id || null,
      },
    };

    // Try to save acknowledgement to backend (non-blocking)
    try {
      const base = process.env.REACT_APP_API_BASE || "";
      const res = await fetch(`${base}/api/roomrental/acknowledge-contract`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || `Server responded ${res.status}`);
      }
    } catch (err) {
      console.warn("Acknowledgement save failed:", err);
      setError(t("notice.acknowledgeSaveFailed"));
    } finally {
      // Attempt to close the window; if blocked, navigate to the listing flow
      const fallbackRoute = "/room-listing-request";
      const tryClose = () => {
        try {
          if (window.opener) {
            window.close();
            setTimeout(() => {
              if (!window.closed) nav(fallbackRoute, { replace: true });
            }, 300);
            return;
          }

          window.close();
          setTimeout(() => {
            if (!window.closed) nav(fallbackRoute, { replace: true });
          }, 300);
        } catch (e) {
          nav(fallbackRoute, { replace: true });
        } finally {
          setSaving(false);
        }
      };
      tryClose();
    }
  };

  return (
    <Container style={{ maxWidth: 900, marginTop: 30, marginBottom: 60 }}>
      <h2>{t("page.title")}</h2>
      <p>
        <strong>{t("effectiveDate.label")}</strong> <em>{todayIso}</em>
      </p>
      <p>
        <strong>{t("owner.label")}</strong> <em>{ownerName}</em>
      </p>
      <p>
        <strong>{t("phone.label")}</strong> <em>{ownerPhone}</em>
      </p>

      <section style={{ marginTop: 20 }}>
        <h4>{t("term.title")}</h4>
        <p>{t("term.text")}</p>
      </section>

      <section style={{ marginTop: 16 }}>
        <h4>{t("fees.title")}</h4>
        <p>{t("fees.text")}</p>
      </section>

      <section style={{ marginTop: 16 }}>
        <h4>{t("billing.title")}</h4>
        <p>{t("billing.text")}</p>
      </section>

      <section style={{ marginTop: 16 }}>
        <h4>{t("payouts.title")}</h4>
        <p>{t("payouts.text")}</p>
      </section>

      <section style={{ marginTop: 16 }}>
        <h4>{t("refunds.title")}</h4>
        <p>{t("refunds.text")}</p>
      </section>

      <section style={{ marginTop: 16 }}>
        <h4>{t("cancellations.title")}</h4>
        <p>{t("cancellations.text")}</p>
      </section>

      <section style={{ marginTop: 16 }}>
        <h4>{t("taxes.title")}</h4>
        <p>{t("taxes.text")}</p>
      </section>

      <section style={{ marginTop: 16 }}>
        <h4>{t("damage.title")}</h4>
        <p>{t("damage.text")}</p>
      </section>

      <section style={{ marginTop: 16 }}>
        <h4>{t("data.title")}</h4>
        <p>{t("data.text")}</p>
      </section>

      <section style={{ marginTop: 16 }}>
        <h4>{t("termination.title")}</h4>
        <p>{t("termination.text")}</p>
      </section>

      <section style={{ marginTop: 16 }}>
        <h4>{t("governing.title")}</h4>
        <p>{t("governing.text")}</p>
      </section>

      <section style={{ marginTop: 16 }}>
        <h4>{t("signatures.title")}</h4>
        <p>{t("signatures.text")}</p>
      </section>

      {error && <Alert variant="warning">{error}</Alert>}

      <div className="d-flex justify-content-end" style={{ marginTop: 24 }}>
        <Button variant="primary" onClick={handleAgree} disabled={saving}>
          {saving ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{" "}
              {t("button.saving")}
            </>
          ) : (
            t("button.agree")
          )}
        </Button>
      </div>

      <footer className="text-center py-4 border-top">
        <small>
          <p>
            <strong>{t("whoWeAre.footer.phones")}:</strong> (+244) 222 022 351;
            (+244) 942 154 545; (+244) 921 588 083; (+244) 939 207 046
            <br />
            {t("whoWeAre.footer.address")}
          </p>
          &copy; {new Date().getFullYear()} LM-Ltd Services.{" "}
          {t("whoWeAre.footer.copyright")}
        </small>
      </footer>
    </Container>
  );
}